const express = require('express');
const router = express.Router();
const listpro = require('./models/listpro_schema');
const products = require('./models/product_schema');
const jwt = require('./jwt');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');
router.get('/listpro', jwt.verify, async (req, res) => {
  try {
    await listpro
      .find({ user_id: req.userId })
      .populate('product')
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: 'success',
            message: 'Fetch Productions Successfully',
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.get('/listpro/:id', async (req, res) => {
  try {
    await listpro
      .findById({ _id: req.params.id })
      .populate('product')
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: 'success',
            message: 'Fetch Single Productions Successfully',
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.get('/listpro_getproduct', jwt.verify, async (req, res) => {
  try {
    let data = await products
      .find({ user_id: req.userId })
      .select({ name: 1, _id: 1 })
      .sort({ created: -1 });
    res.json({
      result: 'success',
      message: 'Fetch Single Productions Successfully',
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ result: 'error', message: err.msg });
  }
});

router.post('/listpro', jwt.verify, async (req, res) => {
  // console.log(req)
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let newListpro = await listpro.create({
        tanggal: fields.tanggal,
        name: fields.name,
        quantity: fields.quantity,
        order: fields.order,
        duedate: fields.duedate,
        description: fields.description,
        cost: fields.cost,
        status: fields.status,
        user_id: req.userId
      });
      if (newListpro.status == 'done') {
        let qty = newListpro.quantity;
        let product_arr = fields.product.split(',');
        const product = await products.find().where('_id').in(product_arr).exec();
        console.log(product[0]._id)
        let map = new Map([['_id', product[0]._id]]);
        let obj = Object.fromEntries(map);
        let astock = await products.findOne(obj, { stock: 1, _id: 0 });
        var stock1 = Number(astock.stock);
         let updateStockProduct = await products.findOneAndUpdate(obj, {
           stock: stock1+=qty,
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
      
      let product_arr = fields.product.split(',');
      const product = await products.find().where('_id').in(product_arr).exec();
      console.log(newListpro);
      newListpro.product = product;
      await newListpro.save()
      res.json({
        result: 'success',
        message: 'Create Production Successfully',
      });
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.put('/listpro', async (req, res) => {
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let updateListpro = await listpro.findByIdAndUpdate(
        { _id: fields.id },
        { name: fields.name, quantity: fields.quantity, order: fields.order, duedate: fields.duedate, description: fields.description, cost: fields.cost, status: fields.status }
      );
      var a = fields.status;
      console.log (a);
      if (fields.status == 'done') {
        let qty = updateListpro.quantity;
        let product_arr = fields.product.split(',');
        const product = await products.find().where('_id').in(product_arr).exec();
        // console.log(product[0]._id)
        let map = new Map([['_id', product[0]._id]]);
        let obj = Object.fromEntries(map);
        let astock = await products.findOne(obj, { stock: 1, _id: 0 });
        var stock1 = Number(astock.stock);
         let updateStockProduct = await products.findOneAndUpdate(obj, {
           stock: stock1+=qty,
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
      let product_arr = fields.product.split(',');
      const product = await products.find().where('_id').in(product_arr).exec();
      updateListpro.product = product;
      await updateListpro.save();
      res.json({
        result: 'success',
        message: 'Update Productions Successfully',
      });
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.delete('/listpro/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await listpro.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: 'success',
      message: 'Delete Productions Material Successfully',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
module.exports = router;
