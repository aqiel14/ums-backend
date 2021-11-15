const mongoose = require("mongoose");
const schema = mongoose.Schema({
  materialname: String,
  amount: Number,
  materialneeded: Number,
  prounit: String,
  materialunit: String,
  product: [
    { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
  ],

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("bahan", schema);
