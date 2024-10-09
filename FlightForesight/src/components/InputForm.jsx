import React, { useState } from 'react';
import axios from 'axios';

const InputForm = ({ onPrediction }) => {
    const [inputs, setInputs] = useState({
        date: '',
        originAirport: '',
        destinationAirport: '',
        scheduledDeparture: '',
        scheduledArrival: '',
        departureDelay: '',
        distance: ''
    });

    const [errors, setErrors] = useState({
        originAirport: '',
        destinationAirport: '',
        distance: ''
    });

    const validateAirportCode = (code) => /^[A-Z]{3}$/.test(code); // Regex for exactly 3 uppercase letters

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });

        // Validate airport codes
        if (name === 'originAirport' || name === 'destinationAirport') {
            if (!validateAirportCode(value)) {
                setErrors({ ...errors, [name]: 'Invalid IATA code. Must be 3 uppercase letters.' });
            } else {
                setErrors({ ...errors, [name]: '' });
            }
        }

    };

    const convertToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { scheduledDeparture, scheduledArrival, date, ...inputData } = inputs;

        // Convert times to minutes from midnight
        inputData.scheduledDeparture = convertToMinutes(scheduledDeparture);
        inputData.scheduledArrival = convertToMinutes(scheduledArrival);

        // Check if there are any errors before submitting
        if (errors.originAirport || errors.destinationAirport || errors.distance) {
            alert("Please fix the errors before submitting.");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', inputData);
            onPrediction(response.data.prediction);
        } catch (error) {
            console.error("Prediction Error: ", error);
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        setInputs({
            ...inputs,
            date: e.target.value,
            month: selectedDate.getMonth() + 1,
            day: selectedDate.getDate(),
            dayOfWeek: selectedDate.getDay() + 1
        });
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4 p-4 border rounded shadow-sm bg-light">
            <h4 className="mb-4">Flight Information</h4>

            {/* Flight Date */}
            <div className="form-group">
                <label htmlFor="date">Flight Date</label>
                <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={inputs.date}
                    onChange={handleDateChange}
                    required
                />
            </div>

            {/* Origin Airport */}
            <div className="form-group">
                <label htmlFor="originAirport">Origin Airport</label>
                <input
                    type="text"
                    className={`form-control ${errors.originAirport ? 'is-invalid' : ''}`}
                    id="originAirport"
                    name="originAirport"
                    value={inputs.originAirport}
                    onChange={handleChange}
                    placeholder="Enter origin airport IATA code"
                    required
                />
                {errors.originAirport && <div className="invalid-feedback">{errors.originAirport}</div>}
            </div>

            {/* Destination Airport */}
            <div className="form-group">
                <label htmlFor="destinationAirport">Destination Airport</label>
                <input
                    type="text"
                    className={`form-control ${errors.destinationAirport ? 'is-invalid' : ''}`}
                    id="destinationAirport"
                    name="destinationAirport"
                    value={inputs.destinationAirport}
                    onChange={handleChange}
                    placeholder="Enter destination airport IATA code"
                    required
                />
                {errors.destinationAirport && <div className="invalid-feedback">{errors.destinationAirport}</div>}
            </div>

            {/* Scheduled Departure Time */}
            <div className="form-group">
                <label htmlFor="scheduledDeparture">Scheduled Departure Time</label>
                <input
                    type="time"
                    className="form-control"
                    id="scheduledDeparture"
                    name="scheduledDeparture"
                    value={inputs.scheduledDeparture}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Scheduled Arrival Time */}
            <div className="form-group">
                <label htmlFor="scheduledArrival">Scheduled Arrival Time</label>
                <input
                    type="time"
                    className="form-control"
                    id="scheduledArrival"
                    name="scheduledArrival"
                    value={inputs.scheduledArrival}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* Departure Delay */}
            <div className="form-group">
                <label htmlFor="departureDelay">Departure Delay (in minutes)</label>
                <input
                    type="number"
                    className="form-control"
                    id="departureDelay"
                    name="departureDelay"
                    value={inputs.departureDelay}
                    onChange={handleChange}
                    placeholder="Enter departure delay"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Predict</button>
        </form>
    );
};

export default InputForm;
