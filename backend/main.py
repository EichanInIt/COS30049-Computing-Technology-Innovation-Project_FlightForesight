from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
from typing import List

app = FastAPI(title="Airport API", description="API for managing and retrieving airport data", version="1.0")

# Load airport data from CSV into a DataFrame
airport_data = pd.read_csv("C:/Users/nguye/Downloads/w/COS30049-Computing-Technology-Innovation-Project_FlightForesight/FlightForesight/src/components/data.csv")
airport_data.columns = ['name', 'latitude', 'longitude', 'iata']  # Ensure proper column names

class Airport(BaseModel):
    """Schema for airport data."""
    name: str
    latitude: float
    longitude: float
    iata: str

@app.get("/airports/", response_model=List[Airport], summary="Get all airports")
async def get_airports():
    """
    Get a list of all airports.

    - **response**: List of airports
    """
    return airport_data.to_dict(orient='records')

@app.get("/airports/{iata_code}", response_model=Airport, summary="Get airport by IATA code")
async def get_airport(iata_code: str):
    """
    Get details of a specific airport by IATA code.

    - **iata_code**: IATA code of the airport
    - **response**: Details of the specified airport
    """
    airport = airport_data[airport_data['iata'].str.upper() == iata_code.upper()]
    if airport.empty:
        raise HTTPException(status_code=404, detail="Airport not found")
    return airport.iloc[0].to_dict()

@app.post("/airports/", response_model=Airport, summary="Add a new airport")
async def add_airport(airport: Airport):
    """
    Add a new airport.

    - **airport**: The airport details to be added
    - **response**: The added airport details
    """
    global airport_data
    new_row = {
        "name": airport.name,
        "latitude": airport.latitude,
        "longitude": airport.longitude,
        "iata": airport.iata.upper(),
    }
    airport_data = airport_data.append(new_row, ignore_index=True)
    return new_row

@app.delete("/airports/{iata_code}", summary="Delete an airport by IATA code")
async def delete_airport(iata_code: str):
    """
    Delete an airport by IATA code.

    - **iata_code**: IATA code of the airport to be deleted
    - **response**: Confirmation of deletion
    """
    global airport_data
    airport = airport_data[airport_data['iata'].str.upper() == iata_code.upper()]
    if airport.empty:
        raise HTTPException(status_code=404, detail="Airport not found")
    airport_data = airport_data[airport_data['iata'].str.upper() != iata_code.upper()]
    return {"detail": f"Airport {iata_code} deleted"}

# To run the FastAPI app, use:
# uvicorn main:app --reload
