const User = require("../database/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

require("dotenv").config();

const aws = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  s3AssetsBucketTemp: process.env.S3_ASSETS_BUCKET_TEMP,
};

AWS.config.update({
  accessKeyId: aws.accessKeyId,
  secretAccessKey: aws.secretAccessKey,
  region: aws.region,
});

const s3 = new AWS.S3();

exports.createdUser = async (req, res) => {
  try {
    const findUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (findUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const password = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email.toLowerCase();
    const newUser = await User.create({
      ...req.body,
      email,
      password,
    });
    if (!newUser) {
      return res.status(400).json({
        message: "User could not be created",
      });
    }

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "User could not be logged in",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userDetail = await User.findById(req.user.id);
    if (!userDetail) {
      return res.status(404).json({
        message: "User not found1",
      });
    }
    if (req.body.email) {
      return res.status(400).json({
        message: "Email cannot be updated",
      });
    }

    if (req.body.password) {
      const password = await bcrypt.hash(req.body.password, 10);
      req.body.password = password;
    }
    const user = await User.updateOne(
      { _id: req.user._id },
      { $set: { ...req.body } }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "User could not be updated",
      error: error.message,
    });
  }
};

exports.seeUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (req.user.role !== "admin") {
      if (user.isProfilePublic === false) {
        return res.status(403).json({
          message: "User profile is private",
        });
      }
      return res.status(200).json({
        user,
      });
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "User could not be found",
      error: error.message,
    });
  }
};

exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const response = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email_verified, email, name } = response.payload;
    if (!email_verified) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        message: "User logged in successfully",
        token,
      });
    }
    const password = email + process.env.JWT_SECRET;
    const newUser = await User.create({
      userName: name,
      email,
      password,
    });
    if (!newUser) {
      return res.status(400).json({
        message: "User could not be created",
      });
    }
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "User could not be logged in",
      error: error.message,
    });
  }
};

exports.uploadPicture = async (req, res) => {
  const { extension } = req.query;

  const bucketName = aws.s3AssetsBucketTemp;
  const randomString = uuidv4().replace(/-/g, "");
  const fileStr = `${randomString}.${extension}`;

  if (!bucketName) throw new BadRequestError("Something went wrong");

  const params = {
    Bucket: bucketName,
    Key: fileStr,
    Expires: 360,
  };

  try {
    const presignedUrl = await s3.getSignedUrlPromise("putObject", params);

    res.status(200).json({
      message: "Success",
      presignedUrl: presignedUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
