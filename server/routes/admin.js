const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Route to create a new user
router.post('/createUser', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Route to update a user's role
router.post('/updateRole', async (req, res) => {
  const { userId, role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json({ message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating role' });
  }
});

// Express.js route to delete a user
router.delete('/deleteUser/:userId', (req, res) => {
  const { userId } = req.params;
  // Logic to delete user from database (e.g., MongoDB)
  User.findByIdAndDelete(userId)
    .then(() => res.status(200).send('User deleted successfully'))
    .catch((err) => res.status(500).send('Error deleting user'));
});


// Route to get all salary requests
router.get('/requests', async (req, res) => {
  try {
    const requests = await Request.find().populate('userId', 'email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

// Route to handle salary requests (accept/reject)
router.post('/handleRequest', async (req, res) => {
  const { requestId, status } = req.body;
  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    request.status = status;
    await request.save();
    res.json({ message: `Request ${status}` });
  } catch (error) {
    res.status(500).json({ error: 'Error handling request' });
  }
});

module.exports = router;
