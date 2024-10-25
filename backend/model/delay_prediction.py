# backend/model/delay_prediction.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import logging
from sklearn.preprocessing import OneHotEncoder, StandardScaler, TargetEncoder
from sklearn.compose import ColumnTransformer
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from model.delay_prediction_db import DelayPrediction, get_db

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

# Load the model 
try:
    model_path = os.path.join("model", "lgbm_regressor_delay.pkl")
    model = joblib.load(model_path)
except Exception as e:
    logging.error(f"Error loading model: {str(e)}")
    raise RuntimeError("Model file not found.")

# Request data model for flight fare prediction
class FlightDelayRequest(BaseModel):
      month: int
      day: int
      daysofweek: int
      originAirport: str
      destinationAirport: str
      scheduledDeparture: int
      scheduledArrival: int
      departureDelay: int
      airTime: float
      distance: int

def transform_features(data: FlightDelayRequest):

    # This function transforms the input data into the feature set used during model training.

    # Create a DataFrame from the input data
    input_df = pd.DataFrame({
        'MONTH': [data.month],
        'DAY': [data.day],
        'DAY_OF_WEEK': [data.daysofweek],
        'ORIGIN_AIRPORT': [data.originAirport],
        'DESTINATION_AIRPORT': [data.destinationAirport],
        'SCHEDULED_DEPARTURE': [data.scheduledDeparture],
        'SCHEDULED_ARRIVAL': [data.scheduledArrival],
        'DEPARTURE_DELAY': [data.departureDelay],
        'AIR_TIME': [data.airTime],
        'DISTANCE': [data.distance],
    })
    
    # Define columns to use for encoding
    categorical_cols_onehot = ["MONTH", "DAY", "DAY_OF_WEEK"]
    categorical_cols_target = ["ORIGIN_AIRPORT", "DESTINATION_AIRPORT"]
    numerical_cols = ["SCHEDULED_DEPARTURE", "DEPARTURE_DELAY", "AIR_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"]

    # At the top of your script, after imports
    preprocessor = ColumnTransformer(
        transformers=[
            ('target_enc', TargetEncoder(), categorical_cols_target),
            ('onehot_enc', OneHotEncoder(drop='first', sparse_output=False, handle_unknown='ignore'), categorical_cols_onehot),
            ('scaler', StandardScaler(), numerical_cols)
        ]
    )

    # Fit the preprocessor on input data and transform
    transformed_features = preprocessor.fit_transform(input_df)

    # Assign feature names to the transformed features
    feature_names = preprocessor.get_feature_names_out()

    # Return the feature set as a DataFrame with feature names
    transformed_df = pd.DataFrame(transformed_features, columns=feature_names)
    return transformed_df

# Prediction endpoint
@app.post("/delay/predict/")
async def predict_flight_fare(flight_data: FlightDelayRequest, db: Session = Depends(get_db)):
    try:
        # Transform input data into model features
        features = transform_features(flight_data)

        # Perform prediction using the loaded model
        predicted_delay = model.predict(features)

        # Store the features and prediction in the database
        flight_prediction = DelayPrediction(
            month=flight_data.month,
            day=flight_data.day,
            daysofweek=flight_data.daysofweek,
            originAirport=flight_data.originAirport,
            destinationAirport=flight_data.destinationAirport,
            scheduledDeparture=flight_data.scheduledDeparture,
            scheduledArrival=flight_data.scheduledArrival,
            departureDelay=flight_data.departureDelay,
            airTime=flight_data.airTime,
            distance=flight_data.distance,
            predicted_delay=round(predicted_delay[0], 2)
        )
        db.add(flight_prediction)
        db.commit()
        db.refresh(flight_prediction)

        # Return the predicted fare (rounded to 2 decimal places)
        return JSONResponse(content={"predicted_delay": round(predicted_delay[0], 2)}, media_type="application/json")
    
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Error predicting flight delay")

# Root endpoint 
@app.get("/delay")
async def root():
    return {"message": "Flight Delay Prediction API is running"}

# Endpoint to get the prediction record stored in the database
@app.get("/delay/predictions/")
async def get_predictions(db: Session = Depends(get_db)):
    predictions = db.query(DelayPrediction).all()
    return predictions

# Main execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

