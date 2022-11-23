
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../middleware/http-error');
const Appointments = require('../models/appointments');


const getAppointmentList = async (req, res, next) => {
    const fileUploadId = req.params.fid;
    let appointmentList;
    try {
         appointmentList = await Appointments.findOne({fileUploadId:fileUploadId });
         // appointmentList =  await Appointments.aggregate(aggragatequery)
    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not get Appointment List.',
        500
      );
      return next(error);
    }
  
    if (!appointmentList) {
      const error = new HttpError(
        'No Appointments found.',
        404
      );
      return next(error);
    }
  
    res.status(200).json({ appointmentList});
  };



exports.getAppointmentList = getAppointmentList;
