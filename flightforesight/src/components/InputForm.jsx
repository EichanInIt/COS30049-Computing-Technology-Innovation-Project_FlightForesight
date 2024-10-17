import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import Plot from "react-plotly.js"; // Import Plotly
import { motion } from "framer-motion";

const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [flightPath, setFlightPath] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pathVisible, setPathVisible] = useState(false); // Control visibility of the flight path

  const fetchAirportsData = async () => {
    try {
      const response = await fetch("airport.json"); // Replace with actual path
      const data = await response.json();
      setAirports(data);
    } catch (error) {
      console.error("Error fetching airports data:", error);
    }
  };

  useEffect(() => {
    fetchAirportsData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const departureAirport = airports.find((airport) => airport.name === departure);
    const arrivalAirport = airports.find((airport) => airport.name === arrival);

    if (!departureAirport || !arrivalAirport) {
      alert("Invalid airport selected.");
      setLoading(false);
      return;
    }

    setFlightPath([departureAirport, arrivalAirport]);
    setConfirmation({
      departure: departureAirport.iata,
      arrival: arrivalAirport.iata,
      departureTime: formatDateTime(departureTime),
      arrivalTime: formatDateTime(arrivalTime),
    });

    setPathVisible(true); // Show flight path
    setLoading(false);
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Plotly data for the flight path
  const plotData = () => {
    if (flightPath.length === 0) return [];

    const latitudes = flightPath.map((airport) => airport.latitude);
    const longitudes = flightPath.map((airport) => airport.longitude);
    const iataCodes = flightPath.map((airport) => airport.iata);

    return [
      {
        type: "scattergeo",
        mode: "lines+markers",
        lat: latitudes,
        lon: longitudes,
        marker: {
          size: 8,
          color: "blue",
        },
        line: {
          width: 2,
          color: "blue",
        },
        text: iataCodes, // Tooltips for airports
        hoverinfo: "text",
      },
    ];
  };

  return (
    <Container>
      <Paper
        elevation={4}
        style={{ padding: "20px", marginTop: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Typography variant="h4" gutterBottom>
          Search Flights
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Departure Airport */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.name} (${option.iata})`} // Display name and IATA code
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Departure Airport"
                    variant="outlined"
                    required
                  />
                )}
                onChange={(event, newValue) => setDeparture(newValue ? newValue.name : "")} // Set only the name
              />
            </Grid>

            {/* Arrival Airport */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.name} (${option.iata})`} // Display name and IATA code
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Arrival Airport"
                    variant="outlined"
                    required
                  />
                )}
                onChange={(event, newValue) => setArrival(newValue ? newValue.name : "")} // Set only the name
              />
            </Grid>

            {/* Departure Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Departure Time"
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Arrival Time */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Arrival Time"
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </form>

        {/* Confirmation Text */}
        {confirmation && (
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Flight from {confirmation.departure} to {confirmation.arrival} scheduled on {confirmation.departureTime}.
          </Typography>
        )}

        {/* Plotly Flight Path */}
        {pathVisible && flightPath.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <Plot
              data={plotData()}
              layout={{
                title: "Flight Path",
                geo: {
                  showland: true,
                  landcolor: "rgb(243, 243, 243)",
                  subunitcolor: "rgb(217, 217, 217)",
                  countrycolor: "rgb(217, 217, 217)",
                  projection: {
                    type: "natural earth",
                  },
                },
                margin: { l: 0, r: 0, b: 0, t: 50, pad: 4 },
              }}
              config={{ displayModeBar: true }} // Show mode bar for interactions
            />
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default FlightSearch;
