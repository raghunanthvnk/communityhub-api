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
const helmet = require('helmet')

const hostname = config.hostname;
const port = config.port;

const auth = require("./app/middleware/auth");
const hubCategoryRoutes = require('./app/routes/hubcategory-routes');
const hubMasterRoutes = require('./app/routes/hubmaster-routes');
const fileUploadRoutes = require('./app/routes/fileupload-routes');
const userRoutes = require('./app/routes/user-routes');
const appointmentRoutes = require('./app/routes/appointment-routes');

app.use(bodyParser.json());
//security 
// app.use(function(req, res, next) { //allow cross origin requests
//     res.setHeader("Access-Control-Allow-Origin", '*');
//     res.setHeader("Access-Control-Allow-Headers", 'Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token,Referer');
//     res.setHeader("Access-Control-Allow-Methods", 'POST, PUT, OPTIONS, DELETE, GET');
//     // res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
// });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization,x-access-token'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
// Setup Helmet and CORS configuration
// app.use(helmet.hidePoweredBy())
// Disabling cors as per sonar suggestion.
// Also cors are handle at ingress level
// app.use(cors())    

//routes
app.use('/api/HubCategory', hubCategoryRoutes);
app.use('/api/HubMaster', hubMasterRoutes);
app.use('/api/Upload',fileUploadRoutes);
app.use('/api/user',userRoutes);
app.use('/api/appointments',appointmentRoutes);


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
