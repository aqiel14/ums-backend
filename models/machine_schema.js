const mongoose = require('mongoose');
const schema = mongoose.Schema({
  machinename: String,
  operator: String,
  capacity: Number,
  unit: String,
  description: String,
  status: String,
  created: { type: Date, default: Date.now },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = mongoose.model('machine', schema);