const mongoose = require("mongoose");
const schema = mongoose.Schema({
  suppliername: String,
  tanggal: Date,
  price: Number,
  qty: Number,
  unit: String,
  total: Number,
  bahan: [
    { type: mongoose.Schema.Types.ObjectId, ref: "bahan", required: true },
  ],
  user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("material", schema);
