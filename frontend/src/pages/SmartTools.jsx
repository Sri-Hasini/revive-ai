import React, { useEffect, useState } from "react";
import "./SmartTools.css";

const API = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const initial = {
  item_name: "Study table", category: "Furniture", condition: "good",
  working: true, age_years: 3, repairable: true,
};

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    throw new Error(typeof detail === "string" ? detail : JSON.stringify(detail || `HTTP ${response.status}`));
  }
  return data;
}

function SmartTools() {
  const [backendStatus, setBackendStatus] = useState("checking");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API}/api/health`, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(() => setBackendStatus("online"))
      .catch(e => { if (e.name !== "AbortError") setBackendStatus("offline"); });
    return () => controller.abort();
  }, []);
  const [form, setForm] = useState(initial);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendError, setRecommendError] = useState("");
  const [recBusy, setRecBusy] = useState(false);
  const [image, setImage] = useState(null);
  const [vision, setVision] = useState(null);
  const [visionError, setVisionError] = useState("");
  const [visionBusy, setVisionBusy] = useState(false);
  const [loc, setLoc] = useState({ lat: "", lon: "", type: "recycle", radius: 5000 });
  const [places, setPlaces] = useState([]);
  const [locError, setLocError] = useState("");
  const [locBusy, setLocBusy] = useState(false);
  const [track, setTrack] = useState({item_name:"Study table", action:"DONATE", weight_kg:2});
  const [trackMessage, setTrackMessage] = useState("");
  const [impact, setImpact] = useState(null);

  async function recommend(e) {
    e.preventDefault(); setRecBusy(true); setRecommendError("");setRecommendation(null);
    try {
      const r = await fetch(`${API}/api/recommendations/generate`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...form,age_years:Number(form.age_years)})
      });
      setRecommendation(await parseResponse(r));
    } catch(err) {setRecommendError(err.message)}
    finally {setRecBusy(false)}
  }
  async function analyze(e) {
    e.preventDefault(); setVisionBusy(true);setVisionError("");setVision(null);
    if (!image) {setVisionError("Choose a JPG, PNG or WEBP image first.");setVisionBusy(false);return;}
    try {
      const body = new FormData();body.append("file", image);
      const r = await fetch(`${API}/api/ai/analyze`, {method:"POST",body});
      const result=await parseResponse(r);setVision(result);
      setForm(old=>({...old, item_name:result.item_name, category:result.category}));
    } catch(err) {setVisionError(err.message)}
    finally {setVisionBusy(false)}
  }
  async function findPlaces(e) {
    e.preventDefault();setLocBusy(true);setLocError("");setPlaces([]);
    try {
      const params=new URLSearchParams({lat:loc.lat,lon:loc.lon,type:loc.type,radius:loc.radius});
      const r=await fetch(`${API}/api/organizations/nearby?${params}`);
      const data=await parseResponse(r);setPlaces(data.organizations||[]);
      if (!data.organizations?.length) setLocError(data.message || "No organizations found nearby.");
    } catch(err) {setLocError(err.message)}
    finally {setLocBusy(false)}
  }
  async function createTransaction(e) {
    e.preventDefault();setTrackMessage("");
    try {
      const r=await fetch(`${API}/api/transactions`, {
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...track,weight_kg:Number(track.weight_kg)})
      });
      const data=await parseResponse(r);
      setTrackMessage(`Demo transaction #${data.transaction.id} recorded (pending, not verified).`);
      await loadImpact();
    } catch(err) {setTrackMessage(err.message)}
  }
  async function loadImpact() {
    try {const r=await fetch(`${API}/api/dashboard/impact`);setImpact((await parseResponse(r)).impact)}
    catch(err){setTrackMessage(err.message)}
  }

  return <div className="smart-tools">
    <div className="smart-heading"><p>REUSE · REPAIR · RECYCLE</p><h1>AI & Sustainability Tools</h1>
      <span>Backend-connected Round 1 demonstrations. Registration and marketplace remain browser-only.</span>
      <p role="status" style={{fontWeight:"bold",color:backendStatus==="online"?"#198754":"#a14d26"}}>
        API status: {backendStatus === "online" ? "Connected to FastAPI" : backendStatus === "checking" ? "Checking…" : "Offline — start backend on port 8000"}
      </p>
    </div>
    <div className="smart-grid">
      <section className="smart-card">
        <h2>🤖 Image identification (Gemini)</h2>
        <p>Requires a configured API key and internet connection. This is the real AI service, not a simulated prediction.</p>
        <form onSubmit={analyze}>
          <label htmlFor="smart-image">Choose image (max 5 MB)</label>
          <input id="smart-image" type="file" accept="image/jpeg,image/png,image/webp"
            onChange={e=>setImage(e.target.files?.[0]||null)}/>
          <button disabled={visionBusy}>{visionBusy ? "Analyzing…" : "Identify item"}</button>
        </form>
        {visionError && <p role="alert" className="smart-error">{visionError}</p>}
        {vision && <div className="smart-result"><strong>{vision.item_name}</strong>
          <p>Category: {vision.category} · AI confidence estimate: {Math.round((vision.confidence||0)*100)}%</p>
          <p>{vision.description}</p><p>Materials: {(vision.materials||[]).join(", ")||"Not identified"}</p></div>}
      </section>
      <section className="smart-card">
        <h2>♻️ Item recommendation</h2><p>Rule-based scoring from your teammate's recommendation engine.</p>
        <form onSubmit={recommend}>
          <label>Item name<input value={form.item_name} required onChange={e=>setForm({...form,item_name:e.target.value})}/></label>
          <label>Category<input value={form.category} required onChange={e=>setForm({...form,category:e.target.value})}/></label>
          <div className="smart-two">
            <label>Condition<select value={form.condition} onChange={e=>setForm({...form,condition:e.target.value})}>
              {['excellent','good','fair','poor'].map(x=><option key={x}>{x}</option>)}</select></label>
            <label>Age (years)<input type="number" min="0" max="100" value={form.age_years}
              onChange={e=>setForm({...form,age_years:e.target.value})} required/></label>
          </div>
          <label className="smart-check"><input type="checkbox" checked={form.working} onChange={e=>setForm({...form,working:e.target.checked})}/> Item works</label>
          <label className="smart-check"><input type="checkbox" checked={form.repairable} onChange={e=>setForm({...form,repairable:e.target.checked})}/> Item can be repaired</label>
          <button disabled={recBusy}>{recBusy?"Checking…":"Get recommendation"}</button>
        </form>
        {recommendError && <p role="alert" className="smart-error">{recommendError}</p>}
        {recommendation && <div className="smart-result">
          <strong>{recommendation.recommended_action} · Reuse score {recommendation.reuse_score}/100</strong>
          <p>{recommendation.reason}</p>
          <p>Other options: {recommendation.alternatives.join(", ")}</p>
        </div>}
      </section>
      <section className="smart-card">
        <h2>📍 Organization locator</h2><p>Searches OpenStreetMap through Overpass. Results depend on local map coverage and external service availability.</p>
        <form onSubmit={findPlaces}>
          <div className="smart-two">
            <label>Latitude<input type="number" step="any" min="-90" max="90" placeholder="e.g. 16.989" value={loc.lat} required onChange={e=>setLoc({...loc,lat:e.target.value})}/></label>
            <label>Longitude<input type="number" step="any" min="-180" max="180" placeholder="e.g. 82.247" value={loc.lon} required onChange={e=>setLoc({...loc,lon:e.target.value})}/></label>
          </div>
          <label>Organization type<select value={loc.type} onChange={e=>setLoc({...loc,type:e.target.value})}>
            <option value="recycle">Recycle</option><option value="e_waste">E-waste</option>
            <option value="donate">Donation</option><option value="repair">Repair</option>
          </select></label>
          <label>Radius (metres)<input type="number" min="100" max="50000" step="100" value={loc.radius} onChange={e=>setLoc({...loc,radius:e.target.value})}/></label>
          <button disabled={locBusy}>{locBusy?"Searching…":"Find organizations"}</button>
        </form>
        {locError && <p role="status" className="smart-error">{locError}</p>}
        {places.length>0 && <div className="smart-result"><strong>{places.length} organizations found</strong>
          <div className="smart-results-list">{places.slice(0,20).map((p,i)=><p key={`${p.name}-${i}`}>
            <strong>{p.name}</strong> · {p.address}<br/>
            <a href={`https://www.openstreetmap.org/?mlat=${p.latitude}&mlon=${p.longitude}#map=16/${p.latitude}/${p.longitude}`}
              target="_blank" rel="noreferrer">View on map</a></p>)}</div>
        </div>}
      </section>
      <section className="smart-card">
        <h2>📊 Material recovery tracking</h2>
        <p>Local SQLite demo records. Entries start as pending and are <b>not</b> automatically verified.</p>
        <form onSubmit={createTransaction}>
          <label>Item name<input required value={track.item_name} onChange={e=>setTrack({...track,item_name:e.target.value})}/></label>
          <div className="smart-two">
            <label>Action<select value={track.action} onChange={e=>setTrack({...track,action:e.target.value})}>
              {['DONATE','REPAIR','REUSE','RECYCLE'].map(x=><option key={x}>{x}</option>)}</select></label>
            <label>Estimated weight (kg)<input required type="number" min="0.1" max="100000" step="0.1" value={track.weight_kg}
              onChange={e=>setTrack({...track,weight_kg:e.target.value})}/></label>
          </div>
          <button>Record demo transaction</button>
        </form>
        {trackMessage && <p role="status" className="smart-result">{trackMessage}</p>}
        <button type="button" className="smart-secondary" onClick={loadImpact}>Refresh impact summary</button>
        {impact && <div className="smart-result"><strong>{impact.total_transactions} transactions recorded</strong>
          <p>Pending: {impact.pending_transactions}</p>
          <p>Recorded estimate: {impact.recorded_weight_kg} kg</p>
          <p>Verified recovered: {impact.verified_recovered_weight_kg} kg</p></div>}
      </section>
    </div>
  </div>;
}
export default SmartTools;
