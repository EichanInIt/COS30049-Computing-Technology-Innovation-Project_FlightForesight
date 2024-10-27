# backend/model/delay_prediction.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import logging
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from model.delay_prediction_db import DelayPrediction, get_db
from sklearn.compose import ColumnTransformer
import math

# Initialize FastAPI app
app = FastAPI()

# CORS middleware to allow communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessors
try:
    model = joblib.load(os.path.join("model", "lgbm_regressor_delay.pkl"))
    preprocessor = joblib.load(os.path.join("preprocessor", "preprocessorfordelays.pkl"))
except Exception as e:
    logging.error(f"Failed to load model or preprocessor: {str(e)}")
    raise RuntimeError("Error loading model or preprocessor.")

# Request data model
class FlightDelayRequest(BaseModel):
    month: int
    day: int
    daysofweek: int
    originAirport: str
    destinationAirport: str
    scheduledDeparture: int
    departureDelay: int
    airTime: float
    distance: int
    scheduledArrival: int

def transform_features(data: FlightDelayRequest):
    input_df = pd.DataFrame({
        'MONTH': [data.month],
        'DAY': [data.day],
        'DAY_OF_WEEK': [data.daysofweek],
        'ORIGIN_AIRPORT': [data.originAirport],
        'DESTINATION_AIRPORT': [data.destinationAirport],
        'SCHEDULED_DEPARTURE': [data.scheduledDeparture],
        'DEPARTURE_DELAY': [data.departureDelay],
        'AIR_TIME': [data.airTime],
        'DISTANCE': [data.distance],
        'SCHEDULED_ARRIVAL': [data.scheduledArrival],
    })

    # Extract components
    label_encoders = preprocessor['label_encoders']
    scaler = preprocessor['scaler']

    # Define column groups
    categorical_cols = list(label_encoders.keys())
    numerical_cols = ["SCHEDULED_DEPARTURE", "DEPARTURE_DELAY", "AIR_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"]

    # Set up column transformer
    column_transformer = ColumnTransformer(
        transformers=[('scaler', scaler, numerical_cols)]
    )

    # Apply label encoders
    for col, encoder in label_encoders.items():
        try:
            input_df[col] = input_df[col].map(lambda x: encoder.transform([x])[0] if x in encoder.classes_ else 0)
        except Exception as e:
            logging.warning(f"Encoding error for {col}: {str(e)}")
            input_df[col] = 0  # Handle unseen labels by setting a default

    # Scale numerical columns
    input_df[numerical_cols] = column_transformer.fit_transform(input_df[numerical_cols])
    
    return input_df[categorical_cols + numerical_cols]

# Prediction endpoint
@app.post("/delay/predict/")
async def predict_delay(flight_data: FlightDelayRequest, db: Session = Depends(get_db)):
    try:
        features = transform_features(flight_data)
        predicted_delay = model.predict(features)

        # Save to database
        prediction_entry = DelayPrediction(
            month=flight_data.month,
            day=flight_data.day,
            daysofweek=flight_data.daysofweek,
            originAirport=flight_data.originAirport,
            destinationAirport=flight_data.destinationAirport,
            scheduledDeparture=flight_data.scheduledDeparture,
            scheduledArrival=flight_data.scheduledArrival,
            departureDelay=flight_data.departureDelay,
            airTime=float(math.ceil(flight_data.airTime * 100)) / 100,
            distance=flight_data.distance,
            predicted_delay=round(predicted_delay[0], 2)
        )
        db.add(prediction_entry)
        db.commit()
        db.refresh(prediction_entry)

        return {"predicted_delay": round(predicted_delay[0], 2)}
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Prediction error.")

# Get stored predictions
@app.get("/delay/predictions/")
async def get_predictions(db: Session = Depends(get_db)):
    return db.query(DelayPrediction).all()

# Run app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
