import React, { useState } from 'react';
import BASE_URL from '../../api';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
        const response = await axios.post(`${BASE_URL}/forgot-password/`, { email });
        setMessage(response.data.message);
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ForgotPassword;
