import { useState } from "react"
import { BrowserRouter as Router ,Route ,Routes } from 'react-router-dom'
import GoogleMap from "./GoogleMap"
import GoogleMapC from "./GoogleMap"
import Header from "./components/Header"
import Home from "./components/Home"

function App() {
  return (
    <>
      <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
        </Routes>
      </Router>
      </>
    </>
  );
}

export default App;
