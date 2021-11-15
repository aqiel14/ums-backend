const express = require('express');
const router = express.Router();
const Order = require('./models/order_schema.js');
const Product = require('./models/product_schema.js');
const jwt = require('./jwt');
var faker = require('faker');
const formidable = require('formidable');

router.post('/order', async (req, res) => {
  try {
    // let pos = [];
    // for (let i = 0; i < 100; i += 1) {
    //   let created = faker.date.between('2021-01-01', '2021-07-28');
    //   let order_profit = faker.datatype.number({ min: 10000, max: 20000 });
    //   let user_id = '60b4e146da112713586fea1e';

    //   let newPos = {
    //     created,
    //     order_profit,
    //     user_id,
    //   };
    //   pos.push(newPos);

    //   // visual feedback always feels nice!
    //   console.log(newPos);
    // }
    // let doc = await Order.create(pos);
    let sumProfit = 0;
    let newOrder = await Order.create(req.body).then(
      req.body.order_list.map(async (item) => {
        let map = new Map([['_id', item._id]]);
        let obj = Object.fromEntries(map);
        let aid1 = await Product.findOne(obj, { _id: 1 });
        let id1 = aid1._id;
        let aname1 = await Product.findOne(obj, { _id: 0, name: 1 });
        let name1 = aname1.name;
        let astock = await Product.findOne(obj, { stock: 1, _id: 0 });
        var profit = Number(item.profit * item.qty);
        sumProfit += profit;
        var stock1 = Number(astock.stock);
        var qty1 = Number(item.qty);
        console.log('Nama Produk yang dibeli : ' + name1);
        console.log('ID Produk yang dibeli : ' + id1);
        console.log('Quantitas yang dibeli : ' + qty1);
        console.log('Stock produk tersebut : ' + stock1);
        console.log('PROFIT BARANG TSB : ' + profit);
        if (stock1 - qty1 >= 0) {
          let result = stock1 - qty1;
          console.log(result);
          let updateStockProduct = await Product.findOneAndUpdate(obj, {
            stock: result,
            function(err, doc) {
              if (err) {
                console.log(err);
              } else {
                console.log('stock updated' + doc.stock);
              }
            },
          });
        } else {
          console.log('ERROR: STOCK BARANG HABIS');
        }
      })
    );
    console.log('TOTAL PROFIT ORDER : ' + sumProfit);
    newOrder.order_profit = sumProfit;
    await newOrder.save();
    res.json({
      result: 'success',
      message: 'Order Submitted',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/order', jwt.verify, async (req, res) => {
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

router.delete('/order/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await Order.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: 'success',
      message: 'Delete Order Successfully',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/order/:id', async (req, res) => {
  try {
    let data = await Order.findById({ _id: req.params.id });
    res.json({
      result: 'success',
      message: 'Fetch Single Supplier data Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

module.exports = router;
