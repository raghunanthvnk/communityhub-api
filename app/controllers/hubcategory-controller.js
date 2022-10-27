
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../middleware/http-error');
const HubCategory = require('../models/hubcategory');
const HubMaster = require('../models/hubmaster');

const getHubCategoryById = async (req, res, next) => {
  const categoryId = req.params.cid;
  let category;
  try {
    category = await HubCategory.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a category.',
      500
    );
    return next(error);
  }

  if (!category) {
    const error = new HttpError(
      'Could not find category for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ category: category.toObject({ getters: true }) });
};

const getHubCategoryList = async (req, res, next) => {
  
    let categoryList;
    try {
        // categoryList = await HubCategory.find();
        const aggragatequery=[
          {
            '$lookup': {
              'from': 'hubmasters', 
              'localField': 'hubmaster', 
              'foreignField': '_id', 
              'as': 'hubs'
            }
          }, 
          {
            '$unwind': {
              'path': '$hubs', 
              'preserveNullAndEmptyArrays': true
            }
          }, 
          {
            '$group': {
              '_id': {
                'name': '$name', 
                'description': '$description', 
                'isdefaultbookingtime': '$isdefaultbookingtime', 
                'updatedby': '$updatedby', 
                'createdby': '$createdby', 
                'isactive': '$isactive'
              }, 
              'NoOfHubs': {
                '$sum': {
                  '$cond': {
                    'if': {
                      '$gte': [
                        '$hubs', 0
                      ]
                    }, 
                    'then': 1, 
                    'else': 0
                  }
                }
              }
            }
          }, {
            '$project': {
              '_id': 0, 
              'name': '$_id.name', 
              'description': '$_id.description', 
              'createdby': '$_id.createdby', 
              'isactive': '$_id.isactive', 
              'updatedby': '$_id.updatedby', 
              'isdefaultbookingtime': '$_id.isdefaultbookingtime', 
              'NoOfHubs': 1
            }
          }
        ]
        categoryList =  await HubCategory.aggregate(aggragatequery)
      console.log(categoryList);
    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not get categoryList.',
        500
      );
      return next(error);
    }
  
    if (!categoryList) {
      const error = new HttpError(
        'No Hub categorys found.',
        404
      );
      return next(error);
    }
  
    res.json({ categoryList});
  };

const createHubCategory = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description, isdefaultbookingtime, createdby } = req.body;

  const createdHubCategory= new HubCategory({
    name,
    description,
    isdefaultbookingtime,
    createdby
  });

  try {
    await createdHubCategory.save();
  } catch (err) {
    console.log(createdHubCategory);
    console.log(err);
    const error = new HttpError(
      'Creating HubCategory failed, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ createdHubCategory });
};

const updateHubCategory = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description ,isdefaultbookingtime,isactive,updatedby} = req.body;
  const categoryId = req.params.cid;

  let hubCategory;
  try {
    hubCategory = await HubCategory.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update hubCategory.',
      500
    );
    return next(error);
  }

  hubCategory.name = name;
  hubCategory.description = description;
  hubCategory.isdefaultbookingtime = isdefaultbookingtime;
  hubCategory.isactive = isactive;
  hubCategory.updatedby = updatedby;

  try {
    await hubCategory.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ hubCategory: hubCategory.toObject({ getters: true }) });
};

const deleteHubCategory = async (req, res, next) => {
  const categoryId = req.params.cid;

  let hubCategory;
  try {
    hubCategory = await HubCategory.findById(categoryId).populate('hubmaster');

  } catch (err) {
   
    const error = new HttpError(
      'Something went wrong, could not delete hubcategory.',
      500
    );
    return next(error);
  }

  if (!hubCategory) {
    const error = new HttpError('Could not find hubcategory for this id.', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await hubCategory.remove({ session: sess });
    // hubCategory.hubmaster.hubcategory.pull(hubCategory);
    // await hubCategory.hubmaster.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not delete hubCategory.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted hubCategory.' });
};

exports.getHubCategoryById = getHubCategoryById;
exports.getHubCategoryList = getHubCategoryList;
exports.createHubCategory = createHubCategory;
exports.updateHubCategory = updateHubCategory;
exports.deleteHubCategory = deleteHubCategory;
