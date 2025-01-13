import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'; // Correct imports
import './App.css';
import AddCar from './components/addCar';
import DisplayCars from './components/displayCars';
import LoginScreen from './components/loginScreen';
import NavBar from './components/navBar';
function App() {
  
  return (
     
    <Router>
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/addCar" element={<AddCar />} />
      <Route path='/displayAllCars' element={<DisplayCars mode="AllCars" />} />
      <Route path='/displayCars' element={<DisplayCars mode="YourCars" />} />
      <Route path='/navBar' element={<NavBar />} />
    
    </Routes>
  </Router>

  );
}

export default App;
