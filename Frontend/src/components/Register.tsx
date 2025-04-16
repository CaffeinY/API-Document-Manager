

// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const RegisterPage: React.FC = () => {
  // State hooks to manage the input fields and error message
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // useNavigate hook to redirect the user after successful registration
  const navigate = useNavigate();

  // Handles the registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send a POST request to the registration endpoint with user input
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        { username, email, password },
        { withCredentials: true }  // Ensure credentials (such as cookies) are sent with the request
      );
      // Registration succeeded, clear any error and redirect to the login page
      setError(null);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
      // Display an error message returned from the backend if available, otherwise a generic message
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '8px',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '320px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        {/* Display error message if registration fails */}
        {error && (
          <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
