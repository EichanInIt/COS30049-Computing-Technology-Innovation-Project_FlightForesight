// src/components/FlightTableForFare.jsx
import React from "react";
import Plot from "react-plotly.js";

const FlightTableForFare = ({ confirmations }) => {
  // Handle multiple flight records
  const tableData = () => {
    if (!confirmations || confirmations.length === 0) return []; 

    // Extract each field into arrays for each column
    const airlines = confirmations.map(record => record.airline);
    const flightClasses = confirmations.map(record => record.flightClass);
    const stops = confirmations.map(record => record.stops);
    const sourceCities = confirmations.map(record => record.sourceCity);
    const destinationCities = confirmations.map(record => record.destinationCity);
    const departureTimes = confirmations.map(record => record.departureTime);
    const arrivalTimes = confirmations.map(record => record.arrivalTime);
    const durations = confirmations.map(record => record.duration);
    const days_lefts = confirmations.map(record => record.days_left);
    const fares = confirmations.map(record => record.fare);

    return [
      {
        type: "table",
        header: {
          values: [
            "Airline",
            "Class",
            "Stops",
            "Source City",
            "Destination City",
            "Departure Time",
            "Arrival Time",
            "Duration (hours)",
            "Days Left Before Departure",
            "Price (AUD)"
          ],
          align: "center",
          line: { width: 1, color: 'black' },
          fill: { color: 'lightgrey' }, 
          font: { family: "Arial, sans-serif", size: 12, color: "black" },
        },
        cells: {
          values: [
            airlines,
            flightClasses,
            stops,
            sourceCities,
            destinationCities,
            departureTimes,
            arrivalTimes,
            durations,
            days_lefts,
            fares
          ],
          align: "center",
          line: { color: "black", width: 1 },
          fill: { color: "white" },
          font: { family: "Arial, sans-serif", size: 12, color: "black" },
        },
      },
    ];
  };

  return (
    <Plot
      data={tableData()}
      layout={{
        title: "Flight Details",
        height: 300,
        margin: { t: 40, l: 0, r: 0, b: 0, pad: 4 },
      }}
      style={{ width: "100%", height: "400px" }} 
    />
  );
};

export default FlightTableForFare;
