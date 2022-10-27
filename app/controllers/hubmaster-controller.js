
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../middleware/http-error');
const HubCategory = require('../models/hubcategory');
const HubMaster = require('../models/hubmaster');

const getHubMasterById = async (req, res, next) => {
  const hubId = req.params.hid;
  let hubMaster;
  try {
    hubMaster = await HubMaster.findById(hubId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a hubMaster.',
      500
    );
    return next(error);
  }

  if (!hubMaster) {
    const error = new HttpError(
      'Could not find hubMaster for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ hubMaster: hubMaster.toObject({ getters: true }) });
};

const getHubMasterList = async (req, res, next) => {
  
    let hubList;
    try {
        hubList = await HubMaster.find();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not get hubList.',
        500
      );
      return next(error);
    }
  
    if (!hubList) {
      const error = new HttpError(
        'No Hubs found.',
        404
      );
      return next(error);
    }
  
    res.json({ hubList});
  };

const createHubMaster = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {  name, code, countrycode, citycode,othercity, address, pincode,
    slotmasterid, timezoneid,isbookingenabled, bookingstarttimeid,
    bookingendtimeid, updatedby, createdby, hubcategoryid } = req.body;

  const createdHubMaster= new HubMaster({
    name,
    code,
    countrycode,
    citycode,
    othercity,
    address,
    pincode,
    slotmasterid,
    timezoneid,
    isbookingenabled,
    bookingstarttimeid,
    bookingendtimeid,
    updatedby,
    createdby,
    hubcategory:hubcategoryid
  });

  let hc; //hubcategory variable
  try {
    hc = await HubCategory.findById(hubcategoryid);
  } catch (err) {
    const error = new HttpError(
      'Creating Hub Master failed, please try again.',
      500
    );
    return next(error);
  }

  if (!hc) {
    const error = new HttpError('Could not find Hub Cateogry for provided id.', 404);
    return next(error);
  }

  try {
    await createdHubMaster.save();

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdHubMaster.save({ session: sess });
    hc.hubmaster.push(createdHubMaster);
    await hc.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    console.log(createdHubMaster);
    console.log(err);
    const error = new HttpError(
      'Creating Hub failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ createdHubMaster });
};

const updateHubMaster = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const {  name, code, countrycode, citycode,othercity, address, pincode,
    slotmasterid, timezoneid,isbookingenabled, bookingstarttimeid,
    bookingendtimeid, updatedby, hubcategoryid } = req.body;
  const hubId = req.params.hid;

  let hubMaster;
  try {
    hubMaster = await HubMaster.findById(hubId);
  } catch (err) {
  
    const error = new HttpError(
      'Something went wrong, could not update Hub.',
      500
    );
    return next(error);
  }

  console.log(hubMaster);
  hubMaster.address = address;
  hubMaster.pincode = pincode;
  hubMaster.countrycode = countrycode;
  hubMaster.citycode = citycode;
  hubMaster.othercity = othercity;
  hubMaster.slotmasterid = slotmasterid;
  hubMaster.timezoneid = timezoneid;
  hubMaster.isbookingenabled = isbookingenabled;
  hubMaster.bookingstarttimeid = bookingstarttimeid;
  hubMaster.bookingendtimeid = bookingendtimeid;
  hubMaster.hubcategory = hubcategoryid;
  hubMaster.updatedby = updatedby;

  try {
    await hubMaster.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update Hub.',
      500
    );
    return next(error);
  }

  res.status(200).json({ hubMaster: hubMaster.toObject({ getters: true }) });
};

const deleteHubMaster = async (req, res, next) => {
  const hubId = req.params.hid;

  let hubMaster;
  try {
    hubMaster = await HubMaster.findById(hubId);

  } catch (err) {
   
    const error = new HttpError(
      'Something went wrong, could not find hub.',
      500
    );
    return next(error);
  }

  if (!hubMaster) {
    const error = new HttpError('Could not find hub for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await hubMaster.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete hub.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted hub.' });
};

exports.getHubMasterById = getHubMasterById;
exports.getHubMasterList = getHubMasterList;
exports.createHubMaster = createHubMaster;
exports.updateHubMaster = updateHubMaster;
exports.deleteHubMaster = deleteHubMaster;
