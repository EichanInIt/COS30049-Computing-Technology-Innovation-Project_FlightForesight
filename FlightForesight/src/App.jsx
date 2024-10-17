import React, { useState } from 'react';
import InputForm from './components/InputForm';
import Navbar from './components/NavBar';
// import PredictionResult from './components/PredictionResult';
// import Charts from './components/Charts';

const App = () => {
    const [prediction, setPrediction] = useState(null);

    const handlePrediction = (pred) => {
        setPrediction(pred);
    };

    return (
        <div className="container mt-5">
            <Navbar />
            <InputForm onPrediction={handlePrediction} />
            {/* {prediction && <PredictionResult prediction={prediction} />}
            {prediction && <Charts data={{ labels: ['Predicted Delay'], values: [prediction] }} />} */}
        </div>
    );
};

export default App;
