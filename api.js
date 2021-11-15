const express = require('express');
const router = express.Router();
require('./db');

router.use(require('./api_auth'));
router.use(require('./api_pos_machine'));
router.use(require('./api_product'));
router.use(require('./api_material'));
// router.use(require("./api_employee"))
// router.use(require("./api_customer"))
router.use(require('./api_supplier'));
router.use(require('./api_branch'));
router.use(require('./api_order'));
router.use(require('./api_stat'));
router.use(require('./api_coststat'));
router.use(require('./api_machine'));
router.use(require('./api_listpro'));
router.use(require('./api_bahan'));

router.get('/loaderio-b059aa86ce02ddc3c8d00f4576b6c467', async (req, res) => {
  try {
    res.json({
      message: 'Fetch Supplier data Successfully',
      data: 'loaderio-b059aa86ce02ddc3c8d00f4576b6c467',
    });
  } catch (err) {
    res.json({ result: 'error', message: err.msg });
  }
});

module.exports = router;
