# ReVive AI — Round 1 integrated demo (24 Nov 2026)

## What is in this package
- Frontend: your `ReviveAI.zip` React pages, unchanged in design. Only `Dashboard.jsx` is updated with **Smart Tools**.
- Backend: FastAPI with modules from teammate uploads (Gemini identification, rule-based recommendations, organization locator, and recovery transaction tracking).
- Recommendation code deduplicated (the two uploaded recommendation versions are identical).
- Locator `tracking_service.py` was a duplicate of its route file and could not run; replaced with a minimal SQLite local-demo service.
- No real user authentication or shared item marketplace is implemented. Donate/Browse/My Donations remain **localStorage**-based; image preview is temporary.

## Windows / VS Code: first-time setup
Open `E:\projects\revive-ai` as the project in VS Code.

**Terminal 1 (backend, from project root):**
```powershell
cd E:\projects\revive-ai
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
if (!(Test-Path .env)) { Copy-Item .env.example .env }
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
When you see `Application startup complete`, leave Terminal 1 open. Open http://127.0.0.1:8000/docs and http://127.0.0.1:8000/api/health.

**Terminal 2 (frontend):**
```powershell
cd E:\projects\revive-ai\frontend
npm install
npm run dev
```
Open http://localhost:5173 and then Dashboard Demo → Smart Tools.

**Tests:**
1. In Smart Tools, try recommendation with Study table/Furniture/good/working yes/age 3/repairable yes. It should return DONATE and a score.
2. Record a tracking transaction (Study table, DONATE, 2 kg) then Refresh impact. It should count a pending transaction.
3. Gemini identification requires a real GEMINI_API_KEY in root `.env` and internet. Restart backend after setting key. `GEMINI_MODEL` is configurable; model availability depends on your account.
4. Organization locator requires internet, public Overpass API availability, and available OpenStreetMap data near entered coordinates.
5. Donate/Browse item demo is browser-only — do not claim it is saved in shared backend.

## Push safely to GitHub
Don't directly overwrite `main`. Create a new `integration/round1` branch **from frontend**, add the files from this ZIP, run the tests above, then commit/push it.
```powershell
git status
git switch frontend
git pull --ff-only origin frontend
git switch -c integration/round1
# After copying this package's added/updated files into the repo:
git add -A
git commit -m "Integrate Round 1 frontend, AI, recommendation and locator"
git push -u origin integration/round1
```
Open a Pull Request to main only after the demo works. For proper preservation of teammates' Git history, review their original PRs; this combined ZIP contains source code only.

## Security
Do not commit `.env`, API keys, `.venv`, `node_modules`, local SQLite data, or `.history`. Never deploy demo tracking endpoints publicly without access controls.
