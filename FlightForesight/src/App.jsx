import React, { useState } from 'react';
import InputForm from './components/InputForm';
// import PredictionResult from './components/PredictionResult';
// import Charts from './components/Charts';

const App = () => {
    const [prediction, setPrediction] = useState(null);

    const handlePrediction = (pred) => {
        setPrediction(pred);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Flight Delay Prediction</h1>
            <InputForm onPrediction={handlePrediction} />
            {/* {prediction && <PredictionResult prediction={prediction} />}
            {prediction && <Charts data={{ labels: ['Predicted Delay'], values: [prediction] }} />} */}
        </div>
    );
};

export default App;
