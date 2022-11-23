const express = require('express')
app = express(),
xlsx=require('xlsx'),
async= require('async'),
multer  = require('multer'),
Appointments = require('../models/appointments');
FileUpload = require('../models/fileuploads');
var fs = require("fs"); // Load the filesystem module

/** Upload code */

var storage = multer.diskStorage({ //multers disk storage settings
destination: function (req, file, cb) {
    cb(null, './uploads/');
},
filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, datetimestamp+"_"+ file.originalname);
}
});

const upload = multer({ //multer settings
            storage: storage
            ,fileFilter: function(_req, file, cb){
                let isvalid= checkFileType(_req,file, cb);
              
                if(isvalid){cb(null, true);}
                else{
                    cb(null, false);
                }
               // cb(null, true);
            }
        }).single('file');
function checkFileType(_req,file, cb){
    let array_of_allowed_files;
    let array_of_allowed_file_types;
    let allowed_file_size;
   
    let mimeType = file.mimetype;

    if(_req.url=='/image'){
        // Array of allowed files
         array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
         array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        // Allowed file size in mb
         allowed_file_size = 2;
    }
    else if(_req.url=='/xls'){
         array_of_allowed_files = ['xls', 'xlsx'];
         array_of_allowed_file_types = 
        ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        // Allowed file size in mb
         allowed_file_size = 2;
    }
    else
    {
       // Array of allowed files
       array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
       array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
      // Allowed file size in mb
       allowed_file_size = 2;
    }  
    // Get the extension of the uploaded file
    const file_extension = file.originalname.slice(
        ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
    );

    // Check if the uploaded file is allowed
    if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(mimeType)) {
         cb('Error: Invalid file.!')
         return false;
    }

    if ((file.size / (1024 * 1024)) > allowed_file_size) {                  
         cb('Error: File too large..!')
         return false;
    }
    return true       
}

function convertDateExcel (excelDate) {
    // Get the number of milliseconds from Unix epoch.
    const unixTime = (excelDate - 25569) * 86400 * 1000;
    return new Date(unixTime);
}
/** API path that will upload the excel files */
const uploadExcelFile = async (req, res, next) =>{
       upload(req,res,function(err){
        
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        // read data from a file and send response
        var workbook = xlsx.readFile('./uploads/'+req.file.filename);
        var sheet_name_list = workbook.SheetNames;
        var data= xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var appointments= new Appointments();
        appointments=data;
        InsertFileInfo(
        req.file.filename,
        req.file.path,
        'Appointments',
        req.file.size,
        'admin'
        ).then(function(fileres){
            console.log(fileres)
            var modifieddata= appointments.map(obj => ({ ...obj,fileUploadId:fileres._id }))
            Appointments.insertMany(modifieddata);
          
            })
        .catch((err) => {
        })
       
        res.send(appointments);
    });
};

const uploadImageFile = async (req, res, next) =>{

    upload(req,res,function(err){
        console.log(req.file);
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        var response = '<a href="/">Home</a><br>'
        response += "Files uploaded successfully.<br>"
        response += `<img src="${req.file.path}" /><br>`
        return res.send(response)
    });
};

const InsertFileInfo = async (filename,path,type,size,userid)=>{

  var fileinfo= new FileUpload({
    filename,
    path,
    type,
    size,
    userid,
    isactive:true
  });
  await fileinfo.save();

  return fileinfo;
};

const getFileUploadList = async (req, res, next) => {
  
    let fileUploadList;
    try {
        fileUploadList = await FileUpload.find();
         // fileUploadList =  await FileUpload.aggregate(aggragatequery)
    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not get files uploaded List.',
        500
      );
      return next(error);
    }
  
    if (!fileUploadList) {
      const error = new HttpError(
        'No file uploaded.',
        404
      );
      return next(error);
    }
  
    res.json({ fileUploadList});
  };
exports.uploadImageFile = uploadImageFile;

exports.uploadExcelFile = uploadExcelFile;
exports.getFileUploadList = getFileUploadList;
exports.fileupload=upload;