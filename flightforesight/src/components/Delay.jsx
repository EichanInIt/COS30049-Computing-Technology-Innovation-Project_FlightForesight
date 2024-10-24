import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import { motion } from "framer-motion";
import FlightPath from './FlightPath';
import FlightTableForDelay from "./FlightTableForDelay";

const Delay = () => {
  const [originAirport, setOriginAirport] = useState("");
  const [destinationAirport, setDestinationAirport] = useState("");
  const [scheduledDeparture, setScheduledDeparture] = useState("");
  const [scheduledArrival, setScheduledArrival] = useState("");
  const [departureDelay, setDepartureDelay] = useState("");
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
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

    const planeVelocity = 880 // The typical speed is between 800 - 965 km/h
    const airTime = distance / planeVelocity * 60; // Convert hours to minutes

    // Extract month, day, and day of week from scheduledDeparture
    const month = ScheduledDepartureTime.getMonth() + 1; // getMonth() is zero-based
    const day = ScheduledDepartureTime.getDate();
    const daysofweek = ScheduledDepartureTime.getDay() + 1; // getDay() is also zero-based (0 for Sunday)

    const data = {
      month,
      day,
      daysofweek,
      originAirport: originAirport.iata,
      destinationAirport: destinationAirport.iata,
      scheduledDeparture,
      scheduledArrival,
      departureDelay,
      airTime: airTime,
      distance: distance
    };

    // try {
    //   const response = await axios.post("http://localhost:8000/delay/predict/", data, {
    //     headers: {
    //       "Content-Type": "application/json"
    //     }
    //   });
    //   console.log("Predicted Delay:", response.data.predicted_delay);
    
    //   // Update state with the confirmation and predicted fare
    //   setConfirmations([...confirmations, {...data, delay: response.data.predicted_delay}]);
    //   setFlightTable(data);
    //   setFlightPath([originAirport, destinationAirport]); // Make sure to use correct keys
    //   setPathVisible(true);
    // } catch (error) {
    //   console.error("Error predicting delay:", error);
    //   alert("Error occurred while predicting delay. Please try again.");
    // } finally {
    //   setLoading(false);
    // }

      console.log("Submitting Data:", data);
      setConfirmations([...confirmations, {...data}]);
      setFlightPath([originAirport, destinationAirport]); 
      setPathVisible(true);
      setFlightTable(data);
      setLoading(false); 
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
                label="Scheduled Arrival"
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
                label="Departure Delay (minutes)"
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

        {/* Flight Path Visualization */}
        {pathVisible && flightPath.length === 2 && (
          <FlightPath flightPath={flightPath} />
        )}

        {/* Flight Details Table Visualization */}
        {confirmations.length > 0 && (
          <FlightTableForDelay confirmations={confirmations} />
        )}
      </Paper>
    </Container>
  );
};

export default Delay;
