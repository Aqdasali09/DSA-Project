import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AudioSearch from './Audio';

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/audio-search" element={<AudioSearch />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
