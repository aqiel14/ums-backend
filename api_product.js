const express = require('express');
const router = express.Router();
const product = require('./models/product_schema');
const supplier = require('./models/supplier_schema');
const jwt = require('./jwt');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');

router.get('/product', jwt.verify, async (req, res) => {
  try {
    const tes = req.userId;
    console.log(tes);
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
router.get('/product/:id', async (req, res) => {
  try {
    await product
      .findById({ _id: req.params.id })
      .populate('supplier')
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: 'success',
            message: 'Fetch Single product Successfully',
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.get('/get_supplier', async (req, res) => {
  try {
    let data = await product
      .find({})
      .select({ alias: 1, _id: 1 })
      .sort({ created: -1 });
    res.json({
      result: 'success',
      message: 'Fetch Single product Successfully',
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ result: 'error', message: err.msg });
  }
});
// Get single
router.get('/product/id/:id', async (req, res) => {
  let doc = await product.findOne({ _id: req.params.id });
  res.json(doc);
});
router.post('/product', async (req, res) => {
  // console.log(req)
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let newproduct = await product.create(fields);
      if (fields.hpp) {
        let profit = Number(fields.price) - Number(fields.hpp);
        console.log(profit);
        newproduct.profit = profit;
        await newproduct.save();
      } else {
        console.log('Tidak ada profit di barnag ini');
      }
      console.log(files.image);
      if (files.image != null) {
        var fileExtention = files.image.name.split('.').pop();
        newproduct.image = `${Date.now()}+${newproduct.name}.${fileExtention}`;
        var newpath =
          path.resolve(__dirname + '/uploaded/images/product/') +
          '/' +
          newproduct.image;

        if (fs.exists(newpath)) {
          await fs.remove(newpath);
        }
        await fs.move(files.image.path, newpath);

        // Update database
        await product.findOneAndUpdate({ _id: newproduct.id }, newproduct);
      }
      res.json({
        result: 'success',
        message: 'Create Product data successfully',
      });
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

uploadImage = async (files, newproduct) => {
  console.log('file');
  if (files.image != null) {
    var fileExtention = files.image.name.split('.').pop();
    newproduct.image = `${Date.now()}+${newproduct.name}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + '/uploaded/images/product/') +
      '/' +
      newproduct.image;

    if (fs.exists(newpath)) {
      await fs.remove(newpath);
    }
    await fs.move(files.image.path, newpath);

    // Update database
    await product.findOneAndUpdate({ _id: newproduct.id }, newproduct);
  }
};
router.put('/product', async (req, res) => {
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let updateproduct = await product.findByIdAndUpdate(
        { _id: fields.id },
        {
          name: fields.name,
          suppliername: fields.suppliername,
          stock: fields.stock,
          price: fields.price,
          hpp: fields.price,
        }
      );

      await uploadImage(files, updateproduct);
      await updateproduct.save();
      res.json({
        result: 'success',
        message: 'Update Brach data successfully',
      });
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
router.delete('/product/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await product.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: 'success',
      message: 'Delete product Successfully',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});
module.exports = router;
