# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import pickle
# import pandas as pd
# import numpy as np
# from typing import Optional
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Allows all origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all methods (POST, GET, OPTIONS, etc.)
#     allow_headers=["*"],  # Allows all headers
# )

# # Load the pre-trained model
# model = pickle.load(open('./model/rf_regressor.pkl', 'rb'))

# # Define a data model for incoming requests
# class FlightFareRequest(BaseModel):
#     airline: str
#     sourceCity: str
#     departureTime: str
#     stops: str
#     arrivalTime: str
#     destinationCity: str
#     class_type: str  # renamed to avoid using Python's reserved keyword 'class'

# # Function to preprocess input data
# def preprocess_data(data):
#     df = pd.DataFrame([data.dict()])
    
#     label_columns = ['airline', 'source_city', 'departure_time', 'stops', 'arrival_time', 'destination_city', 'class']
#     le = LabelEncoder()

#     for column in label_columns:
#         if data[column].dtype == 'object':  # Check if the column is categorical
#             data[column] = le.fit_transform(data[column])
    
#     return df

# @app.post("/predict")
# async def predict_flight_fare(fare_request: FlightFareRequest):
#     # Preprocess the incoming data
#     processed_data = preprocess_data(fare_request)
    
#     # Make the prediction using the pre-loaded model
#     try:
#         prediction = model.predict(processed_data)
#         predicted_fare = np.round(prediction[0], 2)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Prediction failed: " + str(e))

#     # Return the predicted fare along with flight path info
#     return {
#         "predicted_fare": predicted_fare,
#         "flight_path": {
#             "sourceCity": fare_request.sourceCity,
#             "destinationCity": fare_request.destinationCity
#         }
#     }

# # Run the FastAPI server using Uvicorn
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)
