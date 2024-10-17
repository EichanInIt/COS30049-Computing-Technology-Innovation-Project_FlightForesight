// FlightPathChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const FlightPathChart = ({ flightPath }) => {
  const data = {
    labels: flightPath.map((_, index) => `Point ${index + 1}`),
    datasets: [
      {
        label: 'Flight Path',
        data: flightPath.map(coord => ({ x: coord.lon, y: coord.lat })),
        fill: false,
        borderColor: 'blue',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} options={{ responsive: true, scales: { x: { title: { display: true, text: 'Longitude' } }, y: { title: { display: true, text: 'Latitude' } } } }} />;
};

export default FlightPathChart;
