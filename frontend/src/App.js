import "./App.css";
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import RecruitDB from "./page/recruitDB";
import Login from "./page/login";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path={"/"} element={<Login />} />
          <Route path={"/recruitDB"} element={<RecruitDB />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
