const express = require('express');
const { check } = require('express-validator');
const HttpError = require('../middleware/http-error');
const router = express.Router();
const appointmentController = require('../controllers/appointment-controller');

router.get('/:fid',appointmentController.getAppointmentList);

module.exports = router;