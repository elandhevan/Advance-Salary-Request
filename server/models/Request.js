const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected'] },
});

module.exports = mongoose.model('Request', requestSchema);
