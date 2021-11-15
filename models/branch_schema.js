const mongoose = require('mongoose');
const schema = mongoose.Schema({
  alias: String,
  tanggal: String,
  address: String,
  tel: String,
  frontimage: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  pos_machines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'pos_machines' }],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('branch', schema);
