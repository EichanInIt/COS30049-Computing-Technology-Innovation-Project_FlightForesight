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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { motion } from "framer-motion";
import FlightPath from './FlightPath';
import FlightTableForDelay from "./FlightTableForDelay";

const Fare = () => {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [daysofweek, setDaysOfWeek] = useState("");
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [scheduledDeparture, setScheduledDeparture] = useState("");
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [departureDelay, setDepartureDelay] = useState("");
  const [airTime, setAirTime] = useState("");
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [flightPath, setFlightPath] = useState([]);
  const [pathVisible, setPathVisible] = useState(false);
  const [flightTable, setFlightTable] = useState(null);

  // Fetch airports and airlines
  const fetchAirportsData = async () => {
    try {
      const response = await fetch("airports.json"); // Replace with actual path
      const data = await response.json();
      setAirports(data);
    } catch (error) {
      console.error("Error fetching airports data:", error);
    }
  };

  useEffect(() => {
    fetchAirportsData();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);  // Convert degrees to radians
    const R = 6371; // Radius of the Earth in kilometers

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (originAirport === destinationAirport) {
      alert("Please select different airports.");
      setLoading(false);
      return;
    }

    // Convert the date and time inputs to Date objects
    const ScheduledDepartureTime = new Date(scheduledDeparture);
    const ScheduledArrivalTime = new Date(scheduledArrival);

    if (ScheduledArrivalTime <= ScheduledDepartureTime) {
      alert("Arrival time must be after the departure time. Please choose again.");
      setLoading(false);
      return;
    }

    // Calculate the days left before departure
    const today = new Date(); // Get today's date

    if (ScheduledDepartureTime <= today) {
      alert("The day you bought the ticket must be before the departure time. Please choose again.");
      setLoading(false);
      return;
    }

    // Calculate the distance using lat/lon of the origin and destination airports
    const distance = calculateDistance(
      originAirport.latitude,
      originAirport.longitude,
      destinationAirport.latitude,
      destinationAirport.longitude
    );

    const data = {
      month,
      day,
      daysofweek,
      originAirport: originAirport.name,
      destinationAirport: destinationAirport.name,
      scheduledDeparture,
      scheduledArrival,
      departureDelay,
      airTime,
      distance: distance
    };

      console.log("Submitting Data:", data);
      setConfirmation(data);
      setFlightPath([originAirport, destinationAirport]); 
      setPathVisible(true);
      setFlightTable(data);
      setLoading(false); 
  };

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

  return (
    <Container>
      <Paper
        elevation={4}
        style={{ padding: "20px", marginTop: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          Flight Delay Prediction
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Month */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Month</InputLabel>
                <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                  <MenuItem value="1">January</MenuItem>
                  <MenuItem value="2">February</MenuItem>
                  <MenuItem value="3">March</MenuItem>
                  <MenuItem value="4">April</MenuItem>
                  <MenuItem value="5">May</MenuItem>
                  <MenuItem value="6">June</MenuItem>
                  <MenuItem value="7">July</MenuItem>
                  <MenuItem value="8">August</MenuItem>
                  <MenuItem value="9">September</MenuItem>
                  <MenuItem value="10">October</MenuItem>
                  <MenuItem value="11">November</MenuItem>
                  <MenuItem value="12">December</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Day */}
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                label="Day"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                }}
                className="custom-textfield"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </Grid>

            {/* Days Of Week */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Days Of Week</InputLabel>
                <Select value={daysofweek} onChange={(e) => setDaysOfWeek(e.target.value)}>
                  <MenuItem value="1">Sunday</MenuItem>
                  <MenuItem value="2">Monday</MenuItem>
                  <MenuItem value="3">Tuesday</MenuItem>
                  <MenuItem value="4">Wednesday</MenuItem>
                  <MenuItem value="5">Thursday</MenuItem>
                  <MenuItem value="6">Friday</MenuItem>
                  <MenuItem value="7">Saturday</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Origin Airport */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.name} (${option.iata})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Origin Airport"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                    }}
                    className="custom-textfield"
                    required
                  />
                )}
                onChange={(event, newValue) => setOriginAirport(newValue)}
              />
            </Grid>

            {/* Destination Airport */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.name} (${option.iata})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination Airport"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                    }}
                    className="custom-textfield"
                    required
                  />
                )}
                onChange={(event, newValue) => setDestinationAirport(newValue)}
              />
            </Grid>

            {/* Scheduled Departure */}
            <Grid item xs={12} md={6}>
              <TextField
                type="datetime-local"
                label="Scheduled Departure"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                  shrink: true
                }}
                className="custom-textfield"
                value={scheduledDeparture}
                onChange={(e) => setScheduledDeparture(e.target.value)}
              />
            </Grid>

            {/* Scheduled Arrival */}
            <Grid item xs={12} md={6}>
              <TextField
                type="datetime-local"
                label="Departure Date"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                  shrink: true
                }}
                className="custom-textfield"
                value={scheduledArrival}
                onChange={(e) => setScheduledArrival(e.target.value)}
              />
            </Grid>

            {/* Departure Delay */}
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                label="Departure Delay"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                }}
                className="custom-textfield"
                value={departureDelay}
                onChange={(e) => setDepartureDelay(e.target.value)}
              />
            </Grid>

            {/* Air Time */}
            <Grid item xs={12} md={6}>
              <TextField
                type="number"
                label="Air Time"
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                }}
                className="custom-textfield"
                value={airTime}
                onChange={(e) => setAirTime(e.target.value)}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    backgroundColor: 'var(--primary-color)',
                    fontWeight: 'bold',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'var(--hover-color)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Search"}
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </form>

        {/* Confirmation */}
        {confirmation && (
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            {`Flight from ${confirmation.originAirport.name} to ${confirmation.destinationAirport.name}`}<br />
            {`Scheduled Departure: ${formatDateTime(confirmation.scheduledDeparture)}`}<br />
            {`Scheduled Arrival: ${formatDateTime(confirmation.scheduledArrival)}`}<br />
            {`Departure Delay: ${confirmation.departureDelay}`}<br />
            {`Air Time: ${confirmation.airTime}`}<br />
            {`Distance: ${confirmation.distance.toFixed(2)}`}<br />
          </Typography>
        )}

        {/* Flight Path Visualization */}
        {pathVisible && flightPath.length === 2 && (
          <FlightPath flightPath={flightPath} />
        )}

        {/* Flight Details Table Visualization */}
        {flightTable && (
          <FlightTableForDelay confirmation={confirmation} />
        )}
      </Paper>
    </Container>
  );
};

export default Fare;
