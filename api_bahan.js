const express = require("express");
const router = express.Router();
const bahan = require("./models/bahan_schema");
const products = require("./models/product_schema");
const jwt = require("./jwt");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs-extra");
router.get("/bahan", jwt.verify, async (req, res) => {
  try {
    await bahan
      .find({ user_id: req.userId })
      .populate("product")
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Fetch Material Successfully",
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.get("/bahan/:id", async (req, res) => {
  try {
    await bahan
      .findById({ _id: req.params.id })
      .populate("product")
      .exec(function (err, data) {
        if (err) {
          console.log(err);
        } else {
          res.json({
            result: "success",
            message: "Fetch Single Productions Material Successfully",
            data: data,
          });
        }
      });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.get("/bahan_getproduct", jwt.verify, async (req, res) => {
  try {
    let data = await products
      .find({ user_id: req.userId })
      .select({ name: 1, _id: 1 })
      .sort({ created: -1 });
    res.json({
      result: "success",
      message: "Fetch Single Productions Material Successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.json({ result: "error", message: err.msg });
  }
});

router.post("/bahan", jwt.verify, async (req, res) => {
  // console.log(req)
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let newBahan = await bahan.create({
        materialname: fields.materialname,
        amount: fields.amount,
        materialneeded: fields.materialneeded,
        materialunit: fields.materialunit,
        prounit: fields.prounit,
        user_id: req.userId,
      });
      let product_arr = fields.product.split(",");
      const product = await products.find().where("_id").in(product_arr).exec();
      console.log(newBahan);
      newBahan.product = product;
      await newBahan.save();
      res.json({
        result: "success",
        message: "Create Production Material successfully",
      });
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.put("/bahan", async (req, res) => {
  try {
    var form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      let updateBahan = await bahan.findByIdAndUpdate(
        { _id: fields.id },
        {
          materialname: fields.materialname,
          amount: fields.amount,
          materialneeded: fields.materialneeded,
          materialunit: fields.materialunit,
          prounit: fields.prounit,
        }
      );
      let product_arr = fields.product.split(",");
      const product = await products.find().where("_id").in(product_arr).exec();
      updateBahan.product = product;
      await updateBahan.save();
      res.json({
        result: "success",
        message: "Update Productions Material successfully",
      });
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
router.delete("/bahan/:id", async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await bahan.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: "success",
      message: "Delete Productions Material Successfully",
    });
  } catch (err) {
    res.json({ result: "error", message: err.msg });
  }
});
module.exports = router;
