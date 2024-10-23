from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import os
import logging
from sklearn.preprocessing import LabelEncoder
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI()

# CORS middleware to allow communication with frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model 
try:
    model_path = os.path.join("model", "rf_regressor.pkl")
    model = joblib.load(model_path)
except Exception as e:
    logging.error(f"Error loading model: {str(e)}")
    raise RuntimeError("Model file not found.")

# Request data model for flight fare prediction
class FlightFareRequest(BaseModel):
    airline: str
    sourceCity: str
    destinationCity: str
    departureTime: str
    arrivalTime: str
    stops: str
    flightClass: str
    duration: float
    days_left: int

# Feature transformation function based on the training process
def transform_features(data: FlightFareRequest):
    """
    This function transforms the input data into the feature set used during model training.
    It applies label encoding to categorical variables as done during training.
    """
    # Create a DataFrame from the input data
    input_df = pd.DataFrame({
        'airline': [data.airline],
        'source_city': [data.sourceCity],
        'departure_time': [data.departureTime],
        'stops': [data.stops],
        'arrival_time': [data.arrivalTime],
        'destination_city': [data.destinationCity],
        'class': [data.flightClass],
        'duration': [data.duration],
        'days_left': [data.days_left],
    })
    
    # Apply label encoding to categorical columns (same as done during training)
    label_columns = ['airline', 'source_city', 'departure_time', 'stops', 'arrival_time', 'destination_city', 'class']
    le = LabelEncoder()
    
    for column in label_columns:
        if input_df[column].dtype == 'object':
            input_df[column] = le.fit_transform(input_df[column])

    # Return the feature set as a NumPy array
    return input_df.values

# Prediction endpoint
@app.post("/predict/")
async def predict_flight_fare(flight_data: FlightFareRequest):
    try:
        # Step 1: Transform input data into model features
        features = transform_features(flight_data)

        # Step 2: Perform prediction using the loaded model
        predicted_fare = model.predict(features)

        # Step 3: Return the predicted fare (rounded to 2 decimal places)
        return JSONResponse(content={"predicted_fare": round(predicted_fare[0], 2)}, media_type="application/json")
    
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error predicting flight fare")

# Root endpoint 
@app.get("/")
async def root():
    return {"message": "Flight Fare Prediction API is running"}
    

# Main execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

