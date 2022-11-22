const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/user-controller");
const fileUploadController = require("../controllers/fileupload-controller");

router.post(
  "/register",
  [
    check("first_name").not().isEmpty(),
    check("first_name").isLength({ min: 1 }),
    check("last_name").not().isEmpty(),
    check("last_name").isLength({ min: 1 }),
    check("username").not().isEmpty(),
    check("username").isLength({ min: 7 }),
    check("password").not().isEmpty(),
    check("password").isLength({ min: 7 }),
    check("email").not().isEmpty(),
  ],
  userController.RegisterUser
);
router.post(
  "/updateUser",
  fileUploadController.fileupload,
  [
    check("first_name").not().isEmpty(),
    check("first_name").isLength({ min: 1 }),
    check("last_name").not().isEmpty(),
    check("last_name").isLength({ min: 1 }),
    check("username").not().isEmpty(),
    check("username").isLength({ min: 7 }),
    // check("password").not().isEmpty(),
    // check("password").isLength({ min: 7 }),
    check("email").not().isEmpty(),
  ],
  userController.UpdateUser
);
router.post(
  "/login",
  [
    check("username").not().isEmpty(),
    check("username").isLength({ min: 7 }),
    check("password").not().isEmpty(),
    check("password").isLength({ min: 7 }),
  ],
  userController.Login
);
router.get('/',userController.usersList);
module.exports = router;
