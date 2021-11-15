const mongoose = require('mongoose');
const schema = mongoose.Schema({
  alias: String,
  serial_number: String,
  created: { type: Date, default: Date.now },
  branch: [{ type: mongoose.Schema.Types.ObjectId, ref: 'branch' }],
});
module.exports = mongoose.model('pos_machines', schema);
