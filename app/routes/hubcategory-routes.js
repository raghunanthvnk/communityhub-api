const express = require('express');
const { check } = require('express-validator');

const hubCategoryControllers = require('../controllers/hubcategory-controller');

const router = express.Router();

router.get('/:cid', hubCategoryControllers.getHubCategoryById);

router.get('/', hubCategoryControllers.getHubCategoryList);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  hubCategoryControllers.createHubCategory
);

router.patch(
  '/:cid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('isdefaultbookingtime')
      .not()
      .isEmpty(),
    check('isactive')
      .not()
      .isEmpty(),
    check('updatedby')
      .not()
      .isEmpty(),
  ],
  hubCategoryControllers.updateHubCategory
);

router.delete('/:cid', hubCategoryControllers.deleteHubCategory);

module.exports = router;
