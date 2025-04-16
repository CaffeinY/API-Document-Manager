import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DocViewPage from './components/DocViewPage';
import Login from './components/Login';
import Register from './components/Register';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doc/:id" element={<DocViewPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
