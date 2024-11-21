import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, TextField, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';N

const UserDashboard = () => {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch user's requests
    axios.get(`http://localhost:5000/api/user/requests/${id}`)
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching requests:', err));
  }, []);

  // Submit request for advance salary
  const submitRequest = () => {
    axios.post('http://localhost:5000/api/user/request', { userId: id, amount, description })
      .then((res) => {
        setRequests([...requests, res.data]); // Add the newly created request
        setAmount(''); // Reset form
        setDescription('');
        setSuccessMessage('Request submitted successfully!');
      })
      .catch((err) => {
        console.error('Error submitting request:', err);
        setErrorMessage('Error submitting request');
      });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      {/* Success/Error Message */}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {/* Request Form */}
      <Typography variant="h6">Request Advance Salary</Typography>
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
      />
      <Button variant="contained" color="primary" onClick={submitRequest}>
        Submit Request
      </Button>

      {/* Requested Salary Details */}
      <Typography variant="h6" mt={4}>My Salary Requests</Typography>
      {requests.map((request) => (
        <Box key={request._id} mt={2} p={2} boxShadow={1} borderRadius={2}>
          <Typography>Amount: {request.amount}</Typography>
          <Typography>Description: {request.description}</Typography>
          <Typography>Status: {request.status || 'Pending'}</Typography>
          {request.status === 'accepted' && (
            <Alert severity="success">Your request has been accepted!</Alert>
          )}
          {request.status === 'rejected' && (
            <Alert severity="error">Your request has been rejected!</Alert>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default UserDashboard;
