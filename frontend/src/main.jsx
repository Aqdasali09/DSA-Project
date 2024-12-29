import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AudioSearch from './Audio';
import Splash from './Splash';
import './index.css';
import AboutPage from './About';
import AddSongForm from './form';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/main" element={<App />} />
        <Route path="/audio-search" element={<AudioSearch />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path='/form' element={<AddSongForm />} />
      </Routes>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);
