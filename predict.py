import yfinance as yf
import pandas as pd
from sklearn.linear_model import LogisticRegression

def prepare_data(stock: str):
    df = yf.download(stock + ".JK", period="6mo", interval="1d")

    if df.empty:
        return None

    df['return'] = df['Close'].pct_change()
    df['ma5'] = df['Close'].rolling(5).mean()
    df['ma10'] = df['Close'].rolling(10).mean()

    df['target'] = (df['Close'].shift(-1) > df['Close']).astype(int)

    df = df.dropna()
    return df


def predict_stock(stock: str):
    df = prepare_data(stock)

    if df is None or len(df) < 20:
        return {"error": "Data tidak cukup atau saham tidak valid"}

    X = df[['return', 'ma5', 'ma10']]
    y = df['target']

    model = LogisticRegression()
    model.fit(X, y)

    latest = X.iloc[-1].values.reshape(1, -1)
    prob = model.predict_proba(latest)[0]

    naik_prob = prob[1]
    turun_prob = prob[0]

    prediction = "Naik" if naik_prob > turun_prob else "Turun"
    confidence = max(naik_prob, turun_prob)

    return {
        "stock": stock.upper(),
        "prediction": prediction,
        "confidence": round(float(confidence), 2),
        "prob_naik": round(float(naik_prob), 2),
        "prob_turun": round(float(turun_prob), 2)
    }