const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const appointmentController = require('../controllers/appointment-controller');

router.get('/',appointmentController.getAppointmentList);

module.exports = router;