import React, { useState, useEffect } from "react";
import { 
  Container, 
  Paper, 
  Typography, 
  Grid, 
  Button, 
  TextField, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Autocomplete, 
} from "@mui/material";
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
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAirportsData = async () => {
    try {
      // Simulate fetching airport data (you can replace with an actual API call)
      const data = [
        { name: "Los Angeles International Airport", iata: "LAX" },
        { name: "John F. Kennedy International Airport", iata: "JFK" },
        { name: "Heathrow Airport", iata: "LHR" }
      ];
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

    const departureAirport = airports.find(airport => airport.name === departure);
    const arrivalAirport = airports.find(airport => airport.name === arrival);

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

    setModalOpen(true); // Open confirmation modal
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
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Departure Airport"
                    variant="outlined"
                    required
                  />
                )}
                onInputChange={(event, newValue) => setDeparture(newValue)}
              />
            </Grid>

            {/* Arrival Airport */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={airports}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Arrival Airport"
                    variant="outlined"
                    required
                  />
                )}
                onInputChange={(event, newValue) => setArrival(newValue)}
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

        {/* Confirmation Modal */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Flight Confirmation</DialogTitle>
          <DialogContent>
            {confirmation && (
              <>
                <Typography>Departure Airport: {confirmation.departure}</Typography>
                <Typography>Arrival Airport: {confirmation.arrival}</Typography>
                <Typography>Scheduled Departure Time: {confirmation.departureTime}</Typography>
                <Typography>Scheduled Arrival Time: {confirmation.arrivalTime}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Future flight path or other visualizations can go here */}
    </Container>
  );
};

export default FlightSearch;
