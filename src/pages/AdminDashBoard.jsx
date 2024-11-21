import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, Typography, Alert } from '@mui/material';
import './Admin.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user', // default role
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch users and requests
    axios.get('http://localhost:5000/api/admin/users')
      .then((res) => setUsers(res.data))
      .catch((err) => console.error('Error fetching users:', err));

    axios.get('http://localhost:5000/api/admin/requests')
      .then((res) => setRequests(res.data))
      .catch((err) => console.error('Error fetching requests:', err));
  }, []);

  // Handle open/close modal
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Create new user
  const createUser = () => {
    axios.post('http://localhost:5000/api/admin/createUser', newUser)
      .then((res) => {
        setUsers([...users, res.data]); // Add newly created user from the response
        setNewUser({ email: '', password: '', role: 'user' }); // Reset form
        setSuccessMessage('User created successfully!');
        setOpenModal(false); // Close modal
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        setErrorMessage('Error creating user');
      });
  };

  // Update user role (admin/user)
  const updateUserRole = (userId, role) => {
    axios.post('http://localhost:5000/api/admin/updateRole', { userId, role })
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userId ? { ...user, role } : user))
        );
        setSuccessMessage(`User role updated to ${role}`);
      })
      .catch((error) => {
        console.error('Error updating user role:', error);
        setErrorMessage('Error updating user role');
      });
  };

  // Handle salary requests (accept/reject)
  const handleRequest = (requestId, status) => {
    axios.post('http://localhost:5000/api/admin/handleRequest', { requestId, status })
      .then(() => {
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status } : request
          )
        );
        setSuccessMessage(`Request ${status}`);
      })
      .catch((error) => {
        console.error('Error handling request:', error);
        setErrorMessage('Error handling request');
      });
  };

   // Delete user
   const deleteUser = (userId) => {
    axios.delete(`http://localhost:5000/api/admin/deleteUser/${userId}`)
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        setSuccessMessage('User deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        setErrorMessage('Error deleting user');
      });
  };

  return (
    <Box className="adminDashboardContainer" p={3}>
      <Typography className="adminDashboardTitle" variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Success/Error Message */}
      {successMessage && <Alert className="alertSuccess" severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert className="alertError" severity="error">{errorMessage}</Alert>}

      {/* Manage Users Section */}
      <Typography className="adminDashboardSubtitle" variant="h6">Manage Users</Typography>
      <Button className="buttonPrimary" variant="contained" color="primary" onClick={handleOpenModal}>
        Create New User
      </Button>

      {/* List of Users */}
      {users.map((user) => (
        <Box className="userCard" key={user._id} mt={2} p={2} boxShadow={1} borderRadius={2}>
          <Typography>Email: {user.email}</Typography>
          <Typography>Role: {user.role}</Typography>
          <Box className="buttonGroup">
            <Button className="buttonPrimary" variant="outlined" color="primary" onClick={() => updateUserRole(user._id, 'admin')}>
              Make Admin
            </Button>
            <Button className="buttonSecondary" variant="outlined" color="secondary" onClick={() => updateUserRole(user._id, 'user')}>
              Make User
            </Button>
            <Button className="buttonError" variant="outlined" color="error" onClick={() => deleteUser(user._id)}>
              Delete User
            </Button>
          </Box>
        </Box>
      ))}

      {/* Manage Salary Requests Section */}
      <Typography className="adminDashboardSubtitle" variant="h6" mt={4}>Manage Salary Requests</Typography>
      {requests.map((request) => (
        <Box className="requestCard" key={request._id} mt={2} p={2} boxShadow={1} borderRadius={2}>
          <Typography>Amount: {request.amount}</Typography>
          <Typography>Description: {request.description}</Typography>
          <Typography>Status: {request.status}</Typography>
          <Box className="buttonGroup">
            <Button
              className="buttonPrimary"
              variant="outlined"
              color="primary"
              onClick={() => handleRequest(request._id, 'accepted')}
            >
              Accept
            </Button>
            <Button
              className="buttonSecondary"
              variant="outlined"
              color="secondary"
              onClick={() => handleRequest(request._id, 'rejected')}
            >
              Reject
            </Button>
          </Box>
        </Box>
      ))}

      {/* Modal for Creating User */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle className="modalTitle">Create New User</DialogTitle>
        <DialogContent className="modalDialog">
          <TextField
            className="modalInput"
            fullWidth
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            className="modalInput"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            className="modalInput"
            fullWidth
            select
            label="Role"
            name="role"
            value={newUser.role}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions className="modalActions">
          <Button className="buttonSecondary" onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button className="buttonPrimary" onClick={createUser} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
