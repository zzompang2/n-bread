import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import Navigation from "./routes/Navigation";
import Home from "./routes/Home";
import About from "./routes/About";
import Calculation from "./routes/Calculation";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Navigation />
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/calculation" component={Calculation} />
    </HashRouter>
  )
}

export default App;
