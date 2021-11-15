const mongoose = require('mongoose');
const schema = mongoose.Schema({
  tanggal: Date,
  name: String,
  quantity: Number,
  order: String,
  duedate: Date,
  cost: Number,
  description: String,
  status: String,
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product',required: true }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('listpro', schema);