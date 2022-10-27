const express = require('express');
const { check } = require('express-validator');

const hubMasterControllers = require('../controllers/hubmaster-controller');

const router = express.Router();

router.get('/:hid', hubMasterControllers.getHubMasterById);

router.get('/', hubMasterControllers.getHubMasterList);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('code').isLength({ min: 5 })
  ],
  hubMasterControllers.createHubMaster
);

router.patch(
  '/:hid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('code').isLength({ min: 5 }),
    check('updatedby')
      .not()
      .isEmpty(),
  ],
  hubMasterControllers.updateHubMaster
);

router.delete('/:hid', hubMasterControllers.deleteHubMaster);

module.exports = router;
