// FlightDetailsTable.js
import React from "react";
import Plot from "react-plotly.js";

const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

const FlightTableForDelay = ({ confirmations }) => {    
  const tableData = () => {
    if (!confirmations || confirmations.length === 0) return []; // Ensure we have confirmation data

    // Extract each field into arrays for each column
    const months = confirmations.map(record => record.month);
    const days = confirmations.map(record => record.day);
    const daysofweeks = confirmations.map(record => record.daysofweek);
    const originAirports = confirmations.map(record => record.originAirport);
    const destinationAirports = confirmations.map(record => record.destinationAirport);
    const scheduledDepartures = confirmations.map(record => formatDateTime(record.scheduledDeparture));
    const scheduledArrivals = confirmations.map(record => formatDateTime(record.scheduledArrival));
    const departureDelays = confirmations.map(record => record.departureDelay);
    const airTimes = confirmations.map(record => record.airTime.toFixed(0));
    const distances = confirmations.map(record => record.distance.toFixed(0));

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
            "Scheduled Departure",
            "Scheduled Arrival",
            "Departure Delay (minutes)",
            "Air Time (minutes)",
            "Distance (km)"
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
            scheduledDepartures, 
            scheduledArrivals,  
            departureDelays,
            airTimes,
            distances
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
      style={{ width: "100%", height: "400px" }} // Adjust height as needed
    />
  );
};

export default FlightTableForDelay;
