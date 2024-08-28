// src/App.tsx
import React from "react";
import MapComponent from "./components/MapComponent";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app-container"> 
      <h1 className="app-title">Aussie Map Coloring</h1>
      <div className="map-wrapper"> 
        <MapComponent />
      </div>
    </div>
  );
};

export default App;
