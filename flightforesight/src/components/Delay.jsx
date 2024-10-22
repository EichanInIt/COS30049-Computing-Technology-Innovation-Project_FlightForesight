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
import FlightTable from "./FlightTable";
import axios from 'axios';

const Delay = () => {
  const [sourceCity, setSourceCity] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [stops, setStops] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [Class, setFlightClass] = useState("");
  const [airports, setAirports] = useState([]);
  const [airline, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [flightPath, setFlightPath] = useState([]);
  const [pathVisible, setPathVisible] = useState(false);
  const [flightTable, setFlightTable] = useState(null); // State to store flight details for the table

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

  const fetchAirlinesData = async () => {
    try {
      const response = await fetch("airlines.json"); // Replace with actual path
      const data = await response.json();
      setAirlines(data);
    } catch (error) {
      console.error("Error fetching airlines data:", error);
    }
  };

  useEffect(() => {
    fetchAirportsData();
    fetchAirlinesData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const source_city = airports.find((airport) => airport.city === sourceCity);
    const destination_city = airports.find((airport) => airport.city === destinationCity);

    if (sourceCity === destinationCity) {
      alert("Please select different cities for source and destination.");
      setLoading(false);
      return;
    }

    const data = {
      airline: selectedAirline,
      sourceCity: source_city.city,
      departureTime,
      stops,
      arrivalTime,
      destinationCity: destination_city.city,
      flightClass: Class,
    };

    console.log("Submitting Data:", data);

    setConfirmation(data);
    setFlightTable(data);

    setFlightPath([source_city, destination_city]);
    setPathVisible(true);

    setLoading(false);
  };

  return (
    <Container>
      <Paper
        elevation={4}
        style={{ padding: "20px", marginTop: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
          Flight Fare Prediction
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Airline */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airline}
                getOptionLabel={(option) => `${option.name} (${option.iata})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Airline"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                    }}
                    className="custom-textfield" 
                    required
                  />
                )}
                onChange={(event, newValue) => setSelectedAirline(newValue ? newValue.name : "")}
              />
            </Grid>

            {/* Source City */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.city} - ${option.name} (${option.iata})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Source City"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                    }}
                    className="custom-textfield"
                    required
                  />
                )}
                onChange={(event, newValue) => setSourceCity(newValue ? newValue.city : "")}
              />
            </Grid>

            {/* Departure Time */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Departure Time</InputLabel>
                <Select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)}>
                  <MenuItem value="early-morning">Early Morning (3:00 AM - 6:00 AM)</MenuItem>
                  <MenuItem value="morning">Morning (6:00 AM - 12:00 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12:00 PM - 6:00 PM)</MenuItem>
                  <MenuItem value="evening">Evening (6:00 PM - 9:00 PM)</MenuItem>
                  <MenuItem value="night">Night (9:00 PM - 12:00 AM)</MenuItem>
                  <MenuItem value="late-night">Late Night (12:00 AM - 3:00 AM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Stops */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Stops</InputLabel>
                <Select value={stops} onChange={(e) => setStops(e.target.value)}>
                  <MenuItem value="zero">Direct</MenuItem>
                  <MenuItem value="one">One Stop</MenuItem>
                  <MenuItem value="two-or-more">Two Or More Stops</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Arrival Time */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Arrival Time</InputLabel>
                <Select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)}>
                  <MenuItem value="early-morning">Early Morning (3:00 AM - 6:00 AM)</MenuItem>
                  <MenuItem value="morning">Morning (6:00 AM - 12:00 PM)</MenuItem>
                  <MenuItem value="afternoon">Afternoon (12:00 PM - 6:00 PM)</MenuItem>
                  <MenuItem value="evening">Evening (6:00 PM - 9:00 PM)</MenuItem>
                  <MenuItem value="night">Night (9:00 PM - 12:00 AM)</MenuItem>
                  <MenuItem value="late-night">Late Night (12:00 AM - 3:00 AM)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Destination City */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => `${option.city} - ${option.name} (${option.iata})`}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destination City"
                    variant="outlined"
                    InputLabelProps={{
                      style: { color: 'var(--primary-color)', fontWeight: 'bold' },
                    }}
                    className="custom-textfield"
                    required
                  />
                )}
                onChange={(event, newValue) => setDestinationCity(newValue ? newValue.city : "")}
              />
            </Grid>

            {/* Flight Class */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth className="custom-textfield" required>
                <InputLabel sx={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Class</InputLabel>
                <Select value={Class} onChange={(e) => setFlightClass(e.target.value)}>
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
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
            {`Flight from ${confirmation.sourceCity} to ${confirmation.destinationCity} with ${confirmation.airline} (${confirmation.flightClass}).`}<br />
            {`Departure time: ${confirmation.departureTime}, Arrival time: ${confirmation.arrivalTime}, Stops: ${confirmation.stops}.`}<br />
          </Typography>
        )}
        
        {/* Flight Path Visualization */}
        {pathVisible && flightPath.length === 2 && (
          <FlightPath flightPath={flightPath} />
        )}

        {/* Flight Details Table Visualization */}
        {flightTable && (
          <FlightTable confirmation={confirmation} />
        )}
      </Paper>
    </Container>
  );
};

export default Delay;

