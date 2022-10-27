const express = require('express')
app = express(),
xlsx=require('xlsx'),
async= require('async'),
multer  = require('multer')
// fs = require('fs');



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

var upload = multer({ //multer settings
            storage: storage
            // ,fileFilter: function(_req, file, cb){
            //     checkFileType(_req,file, cb);
            //     cb(null, true);
            // }
        }).single('file');
function checkFileType(_req,file, cb){
    let array_of_allowed_files;
    let array_of_allowed_file_types;
    let allowed_file_size;

    if(_req.url=='/image'){
        // Array of allowed files
         array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];
         array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
        // Allowed file size in mb
         allowed_file_size = 2;
    }
    if(_req.url=='/xls'){
         array_of_allowed_files = ['xls', 'xlsx'];
         array_of_allowed_file_types = 
        ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        // Allowed file size in mb
         allowed_file_size = 2;
    }  
    // Get the extension of the uploaded file
    const file_extension = file.originalname.slice(
        ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2
    );

    // Check if the uploaded file is allowed
    if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(image.memetype)) {
         cb('Error: Invalid file.!')
    }

    if ((file.size / (1024 * 1024)) > allowed_file_size) {                  
         cb('Error: File too large..!')
    }       
}
/** API path that will upload the excel files */
const uploadExcelFile = async (req, res, next) =>{
    upload(req,res,function(err){
        console.log(req.file);
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
        // read data from a file and send response
        var workbook = xlsx.readFile('./uploads/'+req.file.filename);
        var sheet_name_list = workbook.SheetNames;
        var data= xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        res.send(data);
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


exports.uploadImageFile = uploadImageFile;

exports.uploadExcelFile = uploadExcelFile;