# COS30049 - Computing Technology Innovation Project (CAA Flightforesight)

## File structure

Inside the project folder is divided in to 2 main subfolder including `backend` and `flightforesight`(frontend).
1. Backend:
- Inside the `backend` folder is divided into 2 main subfolder `model` and `preprocessor`. 
- The `model` folder contains the backend of the web itself including the request processing file and 2 pre-trained Machine Learning `.pkl` model: `lgbm_regressor_delay.pkl`, `rf_regressor.pkl`, and `xgboost_tuned_model.pkl`.
- The `preprocessor` folder contains the input processing code sent back from the frontend input form.

2. flightforesight (frontend):
- The `flightforesight` folder is structured as a typical react project which contains `src`, `public`, and `package.json`


```
COS30049-COMPUTING_TECHNOLOGY_INNOVATION_PROJECT\CODE\COS30049-COMPUTING-TECHNOLOGY-INNOVATION-PROJECT_FLIGHTFORESIGHT
│   .DS_Store
│   .gitignore
│   LICENSE
│   README.md
│
├───backend
│   │   .DS_Store
│   │   requirements.txt
│   │  
│   ├───model
│   │      delay_prediction.py
│   │      delay_prediction_db.py
│   │      fare_prediction.py
│   │      fare_prediction_db.py
│   │      lgbm_regressor_delay.pkl
│   │      rf_regressor.pkl
│   │      xgboost_tuned_model.pkl
│   │   
│   └───preprocessor
│           preprocessorfordelay-classify.pkl
│           preprocessorfordelays.pkl
│
└───flightforesight
    │   .gitignore
    │   airlines.json
    │   airports.json
    │   eslint.config.js
    │   index.html
    │   package-lock.json
    │   package.json
    │   README.md
    │   USA_airports.json
    │   vite.config.js
    │
    └───src
        │   App.jsx
        │   main.jsx
        │
        ├───assets
        │       Justin.jpeg
        │       Melvin.jpg
        │       MinhHoangDuong.jpg
        │
        └───components
                components.css
                Delay.jsx
                Fare.jsx
                FlightPath.jsx
                FlightTableForDelay.jsx
                FlightTableForFare.jsx
                Footer.jsx
                home.jsx
                Navbar.jsx
                ScatterPlotForDelay.jsx

```

