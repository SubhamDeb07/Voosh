const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    bio: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isProfilePublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
