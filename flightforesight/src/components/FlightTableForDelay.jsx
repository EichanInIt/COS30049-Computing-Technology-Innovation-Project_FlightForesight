// src/components/FlightTableForDelay.jsx
import React from "react";
import Plot from "react-plotly.js";

const FlightTableForDelay = ({ confirmations }) => { 
    // Handle multiple flight records   
  const tableData = () => {
    if (!confirmations || confirmations.length === 0) return []; 

    // Extract each field into arrays for each column
    const months = confirmations.map(record => record.month);
    const days = confirmations.map(record => record.day);
    const daysofweeks = confirmations.map(record => record.daysofweek);
    const originAirports = confirmations.map(record => record.originAirport);
    const destinationAirports = confirmations.map(record => record.destinationAirport);
    const departureDelays = confirmations.map(record => record.departureDelay);
    const airTimes = confirmations.map(record => record.airTime.toFixed(0));
    const distances = confirmations.map(record => record.distance.toFixed(0));
    const arrivalDelays = confirmations.map(record => record.delay);
    const classifyDelays = confirmations.map(record => record.classification);

    return [
      {
        type: "table",
        header: {
          values: [
            "Month",
            "Day",
            "Day Of Week",
            "Origin Airport",
            "Destination Airport",
            "Departure Delay (minutes)",
            "Air Time (minutes)",
            "Distance (km)",
            "Arrival Delay (minutes)",
            "Delay Or Not?"
          ],
          align: "center",
          line: { width: 1, color: 'black' },
          fill: { color: 'lightgrey' }, 
          font: { family: "Arial, sans-serif", size: 12, color: "black" },
        },
        cells: {
          values: [
            months,
            days,
            daysofweeks,
            originAirports,
            destinationAirports,  
            departureDelays,
            airTimes,
            distances,
            arrivalDelays,
            classifyDelays
          ],
          align: "center",
          line: { color: "black", width: 1 },
          fill: { color: "white" },
          font: { family: "Arial, sans-serif", size: 12, color: "black" }
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

export default FlightTableForDelay;
