import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import Navigation from "./routes/Navigation";
import Home from "./routes/Home";
import Calculation from "./routes/Calculation";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Route path="/" exact={true} component={Home} />
      <Route path="/calculation" component={Calculation} />
    </HashRouter>
  )
}

export default App;
