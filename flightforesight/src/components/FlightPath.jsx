// FlightPath.jsx
import React from 'react';
import Plot from 'react-plotly.js';

const FlightPath = ({ flightPath }) => {
  const plotData = () => {
    if (flightPath.length < 2) return [];
    const latitudes = flightPath.map((airport) => airport.latitude);
    const longitudes = flightPath.map((airport) => airport.longitude);
    const airportDetails = flightPath.map((airport) => `${airport.name} (${airport.iata}), ${airport.city}`);

    return [
      {
        type: "scattergeo",
        mode: "lines+markers",
        lat: latitudes,
        lon: longitudes,
        marker: {
          size: 8,
          color: "red",
        },
        line: {
          width: 2,
          color: "red",
        },
        text: airportDetails,
        hoverinfo: "text",
      },
    ];
  };

  return (
    <Plot
        data={plotData()}
        layout={{
        title: "Flight Path",
        geo: {
            scope: "world",
            showcoastlines: true, coastlinecolor: "RebeccaPurple",
            showland: true, landcolor: "lightgreen",
            showocean: true, oceancolor: "lightblue",
            showlakes: true, lakecolor: "blue",
            showrivers: true, rivercolor: "blue",
            showcountries: true, countrycolor: "rebeccapurple",
            projection: {
            type: "orthographic",
            },
        },
        margin: { t: 40, l: 0, r: 0, b: 0 },
        }}
        style={{ width: "100%", height: "400px" }}
    />
  );
};

export default FlightPath;
