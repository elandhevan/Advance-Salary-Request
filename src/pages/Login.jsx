import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // React Router's navigation hook

  const handleLogin = () => {
    // Clear any previous errors
    setError('');

    axios.post('http://localhost:5000/api/user/login', { email, password })
      .then((response) => {
        const { role, userId } = response.data;
        // Redirect based on the role
        if (role === 'admin') {
          navigate(`/admindashboard/${userId}`);
        } else if (role === 'user') {
          navigate(`/userdashboard/${userId}`);
        }
      })
      .catch((error) => {
        setError('Invalid email or password');
      });
  };

  return (
    <Box className="loginPage" p={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        variant="outlined"
        fullWidth
      />

      <Button 
        variant="contained"
        color="primary"
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
