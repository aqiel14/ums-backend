const express = require('express');
const router = express.Router();
const machine = require('./models/machine_schema');
const jwt = require('./jwt');

router.put('/machine', async (req, res) => {
  try {
    let doc = await machine.findByIdAndUpdate({ _id: req.body._id }, req.body);

    res.json({
      result: 'success',
      message: 'Update Machine Information data Successfully',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.post('/machine', jwt.verify, async (req, res) => {
  try {
    let doc = await machine.create(req.body);
    doc.user_id = req.userId;
    doc.save();
    res.json({
      result: 'success',
      message: 'Create Machine Information data Successfully',
    });
  } catch (err) {
    console.log(err);
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/machine', jwt.verify, async (req, res) => {
  try {
    let data = await machine.find({user_id: req.userId }).sort({ created: -1 });
    res.json({
      result: 'success',
      message: 'Fetch Machine Information data Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/machine/:id', jwt.verify, async (req, res) => {
  try {
    let data = await machine.findById({ _id: req.params.id });
    res.json({
      result: 'success',
      message: 'Fetch Single Machine Information data Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.delete('/machine/:id', async (req, res) => {
  // console.log(req.params.id);
  try {
    let response = await machine.findOneAndDelete({ _id: req.params.id });

    res.json({
      result: 'success',
      message: 'Delete Machine Information data Successfully',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

module.exports = router;
