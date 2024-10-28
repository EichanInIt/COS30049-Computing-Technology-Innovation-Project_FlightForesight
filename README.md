# COS30049 - Computing Technology Innovation Project (CAA Flightforesight)

## File structure

The project folder is organized into two main subfolders: backend and flightforesight (frontend).

1. Backend: 
    - The `backend` folder is further divided into two main subfolders: `model` and `preprocessor`.
    - The `model` folder contains the backend logic for the web application, including the request processing files and three pre-trained Machine Learning models: `lgbm_regressor_delay.pkl`, `rf_regressor.pkl`, and `xgboost_tuned_model.pkl`.
    - The `preprocessor` folder has code for processing the input data received from the frontend input form.

2. flightforesight (frontend):
    - The `flightforesight` folder is structured as a standard React project, containing `src`, `public`, and `package.json`.
    - Additional files like `airlines.json`, `airports.json`, and `USA_airports.json` are included for user input validation and processing.
    - Inside the `src` folder, there are two subfolders: `assets` and `components`. The assets folder is used to store media files, such as images of team members, while the `components` folder contains the React components that form the frontend of the web application.


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

## Installation
### Flightforesight (Frontend)

**Important Note**: Ensure that the terminal directory is in the right directory of `./COS30049-COMPUTING_TECHNOLOGY_INNOVATION_PROJECT\CODE\COS30049-COMPUTING-TECHNOLOGY-INNOVATION-PROJECT_FLIGHTFORESIGHT/flightforesight` 