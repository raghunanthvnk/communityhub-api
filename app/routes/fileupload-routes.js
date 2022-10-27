const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const fileUploadController = require('../controllers/fileupload-controller');

router.post('/xls',fileUploadController.uploadExcelFile);
router.post('/Image',fileUploadController.uploadImageFile);


module.exports = router;