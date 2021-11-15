const mongoose = require("mongoose");
const schema = mongoose.Schema({
  name: String,
  suppliername: String,
  stock: Number,
  hpp: Number,
  price: Number,
  profit: { type: Number, default: 0 },
  image: String,
  user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  bahan: [{ type: mongoose.Schema.Types.ObjectId, ref: "bahan" }],
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("product", schema);
