// import { useState } from "react"
import { BrowserRouter as Router ,Route ,Routes,Navigate } from 'react-router-dom'
// import GoogleMap from "./GoogleMap"
// import GoogleMapC from "./GoogleMap"
// import Header from "./components/Header"
import Home from "./components/Home"
import Home2 from './components/Home2';

function App() {
  return (
    <>
      <>
      <Router>
        <Routes>
          <Route path="/:id"  element={<Home/>}></Route>
          <Route path="/request/:id" element={<Home2/>}></Route>
        </Routes>
      </Router>
      </>
    </>
  );
}

export default App;
