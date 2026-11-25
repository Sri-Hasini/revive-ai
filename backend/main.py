"""ReVive AI Round 1 FastAPI integration, for local demonstration."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import ai, recommendations, organizations, transactions

app = FastAPI(title='ReVive AI Round 1 APIs', version='0.1-demo')
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173','http://127.0.0.1:5173'],
    allow_credentials=False,
    allow_methods=['GET','POST','PATCH'],
    allow_headers=['*'],
)
app.include_router(ai.router)
app.include_router(recommendations.router)
app.include_router(organizations.router, prefix='/api', tags=['Locator'])
app.include_router(transactions.router, prefix='/api', tags=['Impact Tracking'])

@app.get('/api/health')
def health():
    return {'status':'ok', 'application':'ReVive AI', 'mode':'round1-local-demo'}
