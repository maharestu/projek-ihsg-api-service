"""
    Ges, download dulu depedancy yang dipake di file-file py ya, 
    
        pip install fastapi uvicorn yfinance pandas scikit-learn
    
    copas aja line di atas ke terminal. Terus buat nyalain servernya

        uvicorn src.app.trading.main:app --reload --port 8000
"""

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from predict import predict_stock
from roboAdvisor import robo_advisor_logic

app = FastAPI()

# Schema Input Robo
class UserProfile(BaseModel):
    modal: int
    jangka_waktu: str
    tujuan: str
    risk_tolerance: int
    reaksi_rugi: int
    pengalaman: int

# Endpoint Prediksi
@app.get("/predict")
def predict(stock: str):
    return predict_stock(stock)

# Endpoint Robo Advisor
@app.post("/robo-advisor")
def robo(user: UserProfile):
    return robo_advisor_logic(user.dict())

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://project-ihsg.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)