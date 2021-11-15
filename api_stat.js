const express = require('express');
const router = express.Router();
const product = require('./models/product_schema');
const jwt = require('./jwt');
const Order = require('./models/order_schema.js');
const Listpro = require('./models/listpro_schema.js');
router.get('/stat/current_inventory', jwt.verify, async (req, res) => {
  try {
    await product.find({ user_id: req.userId }).exec(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          result: 'success',
          message: 'Fetch product Successfully',
          data: data,
        });
      }
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/stat/current_order', jwt.verify, async (req, res) => {
  try {
    let data = await Order.find({ user_id: req.userId }).sort({ created: -1 });
    res.json({
      result: 'success',
      message: 'Fetch Order Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.get('/stat/current_listpro', jwt.verify, async (req, res) => {
  try {
    let data = await Listpro.find({ user_id: req.userId }).sort({
      created: -1,
    });
    res.json({
      result: 'success',
      message: 'Fetch Listpro Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
module.exports = router;
