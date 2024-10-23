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

const FlightTableForDelay = ({ confirmation }) => {    
  const tableData = () => {
    if (!confirmation) return []; // Ensure we have confirmation data

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
            [confirmation.month],
            [confirmation.day],
            [confirmation.daysofweek],
            [confirmation.originAirport],
            [confirmation.destinationAirport],
            [formatDateTime(confirmation.scheduledDeparture)], 
            [formatDateTime(confirmation.scheduledArrival)],  
            [confirmation.departureDelay],
            [confirmation.airTime],
            [confirmation.distance.toFixed(2)]
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
      style={{ width: "100%", height: "400px" }} // Adjust height as needed
    />
  );
};

export default FlightTableForDelay;
