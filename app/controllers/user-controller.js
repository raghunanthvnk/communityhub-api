// importing user context
const User = require("../models/user");
const express = require('express'),
bcrypt=require('bcrypt'),
jwt=require('jsonwebtoken'),
app = express()

const RegisterUser = async (req, res, next) =>{
    // Our register logic starts here
   try {
    // Get user input
    const { first_name, last_name, email,username, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && username)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email.toLowerCase(), // sanitize
      username:username,
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
};


const Login = async (req, res, next) =>{

  // Our login logic starts here
  try {
    // Get user input
    const { username, password } = req.body;

    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username,email:user.email },
        process.env.SECRET,
        {
          expiresIn: "5h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
    
  // Our login logic ends here
 }  catch (err) {
    console.log(err);
  }
};
exports.RegisterUser = RegisterUser;
exports.Login = Login;
