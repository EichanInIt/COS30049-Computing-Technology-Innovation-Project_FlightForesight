from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import os

app = FastAPI()

# Load airport data from CSV
DATA_FILE = "./data.csv"
airport_data = {}

def load_airport_data():
    global airport_data
    df = pd.read_csv(DATA_FILE)
    for index, row in df.iterrows():
        airport_data[row['iata'].strip()] = {
            "name": row['name'],
            "lat": row['latitude'],
            "lon": row['longitude']
        }

load_airport_data()

# Define request and response models
class FlightRequest(BaseModel):
    departure: str
    arrival: str
    departureTime: str
    arrivalTime: str

class FlightResponse(BaseModel):
    confirmation: dict
    flightPath: list

@app.post("/search-flight", response_model=FlightResponse)
async def search_flight(request: FlightRequest):
    departure = request.departure.strip().upper()
    arrival = request.arrival.strip().upper()

    departure_airport = airport_data.get(departure)
    arrival_airport = airport_data.get(arrival)

    if not departure_airport or not arrival_airport:
        raise HTTPException(status_code=400, detail="Invalid IATA codes")

    flight_path = [departure_airport, arrival_airport]

    confirmation = {
        "departure": departure,
        "arrival": arrival,
        "departureTime": request.departureTime,
        "arrivalTime": request.arrivalTime,
    }

    return FlightResponse(confirmation=confirmation, flightPath=flight_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
