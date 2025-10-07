import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const loginurl = `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`;

export default function Login() {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({ email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('Logging In...');
    try {
      const response = await fetch(loginurl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setStatusMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 700);
      } else {
        setStatusMessage(`ERROR: ${data.message || 'Login failed.'}`);
      }
    } catch (err) {
      setStatusMessage('FATAL ERROR: Could not connect to the server.');
      console.error('Network Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Welcome Back</h2>

      <form onSubmit={handlesubmit} className="login-form">
        <input
          type="text"
          name="email"
          placeholder="Enter Email"
          value={formdata.email}
          onChange={(e) =>
            setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          className="login-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formdata.password}
          onChange={(e) =>
            setFormdata((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          className="login-input"
          required
        />

        <button type="submit" className="login-button">
          {loading ? 'Logging In...' : 'Login'}
        </button>

        <h5 className="login-divider">or</h5>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="login-register-button"
        >
          Register
        </button>

        {statusMessage && (
          <p
            className={`login-status ${
              statusMessage.startsWith('ERROR') ? 'error' : 'success'
            }`}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}
