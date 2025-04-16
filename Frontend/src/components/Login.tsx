// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Form submit handler: call backend login API
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Send POST request to /auth/login
            const response = await axios.post(
                `${API_BASE_URL}/auth/login`,
                { username, password },
                { withCredentials: true },
            );
            console.log('Login successful:', response.data);
            // Clear error message after successful login and navigate to home page (or any other page you need)
            setError(null);
            navigate('/');
        } catch (err: any) {
            console.error('Login failed:', err);
            // Display a fixed error message based on the error information returned by the backend
            setError('Invalid username or password');
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
                padding: '80px',
                borderRadius: '8px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '320px'
            }}>
                {/* Changed title to APM */}
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>
                    Welcome to API Document Manager
                </h2>
                {error && (
                    <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin}>
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
                        Login
                    </button>
                </form>
                {/* Register Button */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#1976d2',
                            border: 'none',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
