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

# Load the regression model and preprocessor components
try:
    regression_model_path = os.path.join("model", "lgbm_regressor_delay.pkl")
    regression_preprocessor_path = os.path.join("preprocessor", "preprocessorfordelays.pkl")
    model = joblib.load(regression_model_path)
    preprocessor_dict = joblib.load(regression_preprocessor_path)  # Load the saved preprocessor as a dictionary

    # Extract label encoders and scaler from the preprocessor dictionary
    label_encoders = preprocessor_dict['label_encoders']
    scaler = preprocessor_dict['scaler']

    # Define columns for each transformer based on original labeling
    categorical_cols = list(label_encoders.keys())
    numerical_cols = ["SCHEDULED_DEPARTURE", "DEPARTURE_DELAY", "AIR_TIME", "DISTANCE", "SCHEDULED_ARRIVAL"]

    # Re-create the ColumnTransformer with the scaler for numerical columns
    reconstructed_preprocessor = ColumnTransformer(
        transformers=[('scaler', scaler, numerical_cols)]
    )
except Exception as e:
    logging.error(f"Error loading model or preprocessor: {str(e)}")
    raise RuntimeError("Model or preprocessor file not found or invalid.")

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
    
    # Apply label encoders to categorical columns
    for col, encoder in label_encoders.items():
        try:
            input_df[col] = encoder.fit_transform(input_df[col])
        except ValueError as e:
            logging.warning(f"Unseen label in column {col}: {e}")
            input_df[col] = input_df[col].apply(lambda x: encoder.fit_transform([x])[0] if x in encoder.classes_ else 0)
    
    # Combine categorical and numerical columns for processing
    # Transform only numerical columns using the scaler
    input_df[numerical_cols] = reconstructed_preprocessor.fit_transform(input_df[numerical_cols])
    
    # Ensure the final DataFrame has all the expected columns
    transformed_df = pd.DataFrame(input_df, columns=categorical_cols + numerical_cols)
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
            airTime=float(math.ceil(flight_data.airTime * 100)) / 100,
            distance=flight_data.distance,
            predicted_delay=round(predicted_delay[0], 2)
        )
        db.add(flight_prediction)
        db.commit()
        db.refresh(flight_prediction)

        # Return the predicted fare (rounded to 2 decimal places)
        return JSONResponse(content={"predicted_delay": round(predicted_delay[0], 2)})
    
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Flight delay cannot be predicted.")

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

