import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DocViewPage from './components/DocViewPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doc/:id" element={<DocViewPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
