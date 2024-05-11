const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const authenticateUser = require("../middleware/authenticateUser");

const {
  createdUser,
  loginUser,
  updateUser,
  seeUser,
  googleLogin,
  uploadPicture,
} = require("../controllers/user");

router.post("/register", authentication, createdUser);

router.post("/login", authentication, loginUser);

router.put("/update", authentication, authenticateUser, updateUser);

router.get("/publicProfile/:id", authentication, authenticateUser, seeUser);

router.post("/googleLogin", authentication, googleLogin);

router.get("/getPresignedUrl", authentication, uploadPicture);

module.exports = router;
