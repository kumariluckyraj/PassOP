import { useState } from 'react'; // Import if you're using state, otherwise remove it
import './App.css'; // Assuming you have some styles for your app
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar /> {/* Rendering the Navbar component */}
      <Manager/>
      <Footer/>
    </>
  );
}

export default App;
