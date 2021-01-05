import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import Calculation from "./routes/Calculation";
import Result from "./routes/Result";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/calculation" component={Calculation} />
      <Route path="/result" component={Result} />
    </HashRouter>
  )
}

export default App;
