// src/components/ScatterPlotForDelay.jsx
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios"; // Import axios for data fetching

const ScatterPlotForDelay = () => { // Removed predictions prop
  const [predictions, setPredictions] = useState([]); // State to hold predictions

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/delay/predictions"); // Replace with your endpoint
        setPredictions(response.data); // Set predictions state
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchPredictions();
  }, []); // Empty dependency array to run once on mount

  // Prepare data for the scatter plot
  const scatterData = () => {
    if (!predictions || predictions.length === 0) return []; 

    const xValues = predictions.map(prediction => prediction.distance); // X-axis data
    const yValues = predictions.map(prediction => prediction.predicted_delay); // Y-axis data

    return [{
      x: xValues,
      y: yValues,
      mode: 'markers',
      type: 'scatter',
      marker: { size: 10, color: 'blue' },
    }];
  };

  return (
    <Plot
      data={scatterData()}
      layout={{
        title: "Predicted Delay vs Distance",
        xaxis: { title: 'Distance (km)' },
        yaxis: { title: 'Predicted Delay (minutes)' },
        height: 400,
        margin: { t: 40, l: 40, r: 40, b: 40, pad: 4 },
      }}
      style={{ width: "100%", height: "400px" }} 
    />
  );
};

export default ScatterPlotForDelay;
