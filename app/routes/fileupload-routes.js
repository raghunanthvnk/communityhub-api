const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../middleware/http-error');
const router = express.Router();
const fileUploadController = require('../controllers/fileupload-controller');

router.post('/xls',fileUploadController.uploadExcelFile);
router.post('/Image',fileUploadController.uploadImageFile);
router.get('/',fileUploadController.getFileUploadList);

module.exports = router;