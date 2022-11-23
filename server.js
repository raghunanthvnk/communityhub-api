const express = require('express')
      app = express(),
      bodyParser = require('body-parser'),
      expressSanitizer = require('express-sanitizer');
      cors = require('cors'),
      router = express.Router(),
      async= require('async'),
      config = require('./config/config');
      mongoose = require('mongoose');
      dotenv = require('dotenv');
      fs = require('fs');
      HttpError = require('./app/middleware/http-error');
      path = require('path')
dotenv.config();
const helmet = require('helmet')

const hostname = config.hostname;
const port = config.port;

const auth = require("./app/middleware/auth");
const hubCategoryRoutes = require('./app/routes/hubcategory-routes');
const hubMasterRoutes = require('./app/routes/hubmaster-routes');
const fileUploadRoutes = require('./app/routes/fileupload-routes');
const userRoutes = require('./app/routes/user-routes');
const appointmentRoutes = require('./app/routes/appointment-routes');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended:false}))

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());


//Serves all the request which includes /images in the url from Uploads folder
app.use('/images', express.static(path.join(__dirname, 'uploads')))

//security 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  // res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//routes
app.use('/api/HubCategory', hubCategoryRoutes);
app.use('/api/HubMaster', hubMasterRoutes);
app.use('/api/Upload',fileUploadRoutes);
app.use('/api/user',userRoutes);
app.use('/api/appointments',appointmentRoutes);
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
     `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/CommunityHub?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.NODEPORT);
    console.log(`Server running at http://${hostname}:${process.env.NODEPORT}/`);
  })
  .catch(err => {
    console.log(err);
  });
