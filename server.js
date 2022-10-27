const http = require('http'),
      express = require('express')
      app = express(),
      bodyParser = require('body-parser'),
      expressSanitizer = require('express-sanitizer');
      cors = require('cors'),
      router = express.Router(),
      async= require('async'),
      config = require('./config/config');
      mongoose = require('mongoose');
      dotenv = require('dotenv');
dotenv.config();

const hostname = config.hostname;
const port = config.port;

const auth = require("./app/middleware/auth");
const hubCategoryRoutes = require('./app/routes/hubcategory-routes');
const hubMasterRoutes = require('./app/routes/hubmaster-routes');
const fileUploadRoutes = require('./app/routes/fileupload-routes');
const userRoutes = require('./app/routes/user-routes');

app.use(bodyParser.json());
//security 
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", config.ClientApplicationUrl);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


//routes
app.use('/api/HubCategory',auth, hubCategoryRoutes);
app.use('/api/HubMaster',auth, hubMasterRoutes);
app.use('/api/Upload',auth,fileUploadRoutes);
app.use('/api/user',userRoutes);

console.log('db url recieved ' + process.env.DB_URL);
console.log('db username recieved ' + process.env.DB_USERNAME);
console.log('db password recieved ' + process.env.DB_PASSWORD);
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
