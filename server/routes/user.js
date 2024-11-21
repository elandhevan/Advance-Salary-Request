// routes/user.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Request = require('../models/Request');


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Send user data along with role
    res.json({ userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Fetch all requests for the authenticated user
router.get('/requests/:userId', async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.params.userId }); // Assuming userId is stored in the request
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Route for a user to submit a salary request
router.post('/request', async (req, res) => {
  const { userId, amount, description } = req.body;
  try {
    const newRequest = new Request({
      userId,
      amount,
      description,
      status: 'pending',  // Default status is 'pending'
    });

    await newRequest.save();
    res.json(newRequest);
  } catch (error) {
    res.status(500).json({ error: 'Error submitting request' });
  }
});

// Optional: Route to fetch a specific request by ID (if needed)
router.get('/request/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request' });
  }
});


module.exports = router;
