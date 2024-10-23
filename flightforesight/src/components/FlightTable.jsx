// FlightDetailsTable.js
import React from "react";
import Plot from "react-plotly.js";

const FlightTable = ({ confirmation }) => {
  const tableData = () => {
    if (!confirmation) return []; // Ensure we have confirmation data

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
            "Price (AUD)"
          ],
          align: "center",
          line: { width: 1, color: 'black' },
          fill: { color: 'lightgrey' }, // Header background color
          font: { family: "Arial, sans-serif", size: 12, color: "black" },
        },
        cells: {
          values: [
            [confirmation.airline],
            [confirmation.flightClass],
            [confirmation.stops],
            [confirmation.sourceCity],
            [confirmation.destinationCity],
            [confirmation.departureTime],
            [confirmation.arrivalTime],
            [confirmation.fare]
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

export default FlightTable;
