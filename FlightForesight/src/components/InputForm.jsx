import React, { useState, useEffect } from "react";
import FlightPathChart from "./FlightPathChart"; // Import the FlightPathChart component
import { 
  TextField, 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  CircularProgress 
} from "@mui/material";

const FlightSearch = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [flightPath, setFlightPath] = useState([]);
  const [airports, setAirports] = useState({});
  const [loading, setLoading] = useState(false);

  const iataRegex = /^[A-Z]{3}$/;

  const fetchAirportsData = async () => {
    try {
      const response = await fetch('http://localhost:8000/airports/');
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      const airportData = {};
      
      data.forEach((airport) => {
        airportData[airport.iata.trim()] = {
          name: airport.name,
          lat: parseFloat(airport.latitude),
          lon: parseFloat(airport.longitude),
        };
      });
      setAirports(airportData);
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

    const departureTrimmed = departure.trim().toUpperCase();
    const arrivalTrimmed = arrival.trim().toUpperCase();

    if (!iataRegex.test(departureTrimmed) || !iataRegex.test(arrivalTrimmed)) {
      alert("Please enter valid IATA codes (3 uppercase letters).");
      setLoading(false);
      return;
    }

    const departureCoords = airports[departureTrimmed];
    const arrivalCoords = airports[arrivalTrimmed];

    if (!departureCoords || !arrivalCoords) {
      alert("Invalid IATA code entered.");
      setLoading(false);
      return;
    }

    setFlightPath([departureCoords, arrivalCoords]);

    setConfirmation({
      departure: departureTrimmed,
      arrival: arrivalTrimmed,
      departureTime: formatDateTime(departureTime),
      arrivalTime: formatDateTime(arrivalTime),
    });

    setLoading(false);
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Search Flights
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Departure Airport (IATA code)"
                value={departure}
                onChange={(e) => setDeparture(e.target.value.toUpperCase())}
                variant="outlined"
                fullWidth
                error={!iataRegex.test(departure)}
                helperText={!iataRegex.test(departure) ? "Invalid IATA code" : ""}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Arrival Airport (IATA code)"
                value={arrival}
                onChange={(e) => setArrival(e.target.value.toUpperCase())}
                variant="outlined"
                fullWidth
                error={!iataRegex.test(arrival)}
                helperText={!iataRegex.test(arrival) ? "Invalid IATA code" : ""}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Departure Time"
                type="datetime-local"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Scheduled Arrival Time"
                type="datetime-local"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {confirmation && (
          <Paper elevation={2} style={{ marginTop: '20px', padding: '10px' }}>
            <Typography variant="h6">Confirmation Details</Typography>
            <Typography>Departure Airport: {confirmation.departure}</Typography>
            <Typography>Arrival Airport: {confirmation.arrival}</Typography>
            <Typography>Scheduled Departure Time: {confirmation.departureTime}</Typography>
            <Typography>Scheduled Arrival Time: {confirmation.arrivalTime}</Typography>
          </Paper>
        )}
      </Paper>

      {flightPath.length > 0 && (
        <Paper elevation={3} style={{ height: "400px", marginTop: "20px" }}>
          <FlightPathChart flightPath={flightPath} />
        </Paper>
      )}
    </Container>
  );
};

export default FlightSearch;
