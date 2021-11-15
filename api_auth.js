const express = require('express');
const router = express();
const Users = require('./models/user_schema');
const jwt = require('./jwt');
const bcrypt = require('bcrypt');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs-extra');
const jsonwebtoken = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  let doc = await Users.findOne({ username: req.body.username });
  if (doc) {
    if (bcrypt.compareSync(req.body.password, doc.password)) {
      const payload = {
        id: doc._id,
        level: doc.level,
        username: doc.username,
        company_name: doc.company_name,
      };

      let token = jwt.sign(payload);
      console.log(token);
      res.json({ result: 'success', token, message: 'Login successfully' });
    } else {
      // Invalid password
      res.json({ result: 'error', message: 'Invalid password' });
    }
  } else {
    // Invalid username
    res.json({ result: 'error', message: 'Invalid username' });
  }
});

router.post('/register', async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 8);
    await Users.create(req.body);
    res.json({ result: 'success', message: 'Register successfully' });
  } catch (err) {
    res.json({ result: 'error', message: err.errmsg });
  }
});

//BELOM DITAMBAH VERIFICATION EMAIL

router.post('/profile', async (req, res) => {
  try {
    await Users.create(req.body);
    res.json({ result: 'success', message: 'Register successfully' });
  } catch (err) {
    res.json({ result: 'error', message: err.errmsg });
  }
});

uploadImage = async (files, doc) => {
  if (files.avatars != null) {
    var fileExtention = files.avatars.name.split('.').pop();
    doc.avatars = `${Date.now()}+${doc.username}.${fileExtention}`;
    var newpath =
      path.resolve(__dirname + '/uploaded/images/user') + '/' + doc.avatars;

    console.log(newpath);
    if (fs.exists(newpath)) {
      await fs.remove(newpath);
    }
    await fs.move(files.avatars.path, newpath);
    console.log(files.avatars.path);

    // Update database
    await Users.findOneAndUpdate({ _id: doc.id }, doc);
  }
};

router.put('/profile', async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let doc = await Users.findOneAndUpdate({ _id: fields.id }, fields);
      console.log(files.avatars);
      if (files.avatars != null) {
        var fileExtention = files.avatars.name.split('.').pop();
        doc.avatars = `${Date.now()}+${doc.username}.${fileExtention}`;
        var newpath =
          path.resolve(__dirname + '/uploaded/images/user') + '/' + doc.avatars;

        console.log(newpath);
        if (fs.exists(newpath)) {
          await fs.remove(newpath);
        }
        await fs.move(files.avatars.path, newpath);
        console.log(files.avatars.path);

        // Update database
        await Users.findOneAndUpdate({ _id: doc.id }, doc);
      }
      // await uploadImage(files, fields);
      res.json({ result: 'success', message: 'Update Successfully' });
    });
  } catch (err) {
    res.json({ result: 'error', message: err.errmsg });
  }
});

router.get('/profile/id/:id', async (req, res) => {
  // let doc = await Users.findOne({ _id: req.params.id });
  // res.json(doc);
  try {
    let data = await Users.findOne({ _id: req.params.id });
    res.json({
      result: 'success',
      message: 'Fetch Single Supplier data Successfully',
      data: data,
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

router.get('/test', async (req, res) => {
  res.send('Hello Heroku');
});

module.exports = router;
