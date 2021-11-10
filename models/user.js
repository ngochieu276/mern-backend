const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      // require: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      // require: true,
      trim: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    dob: {
      type: Date,
      // required: true,
    },
    phone: {
      type: String,
      // required: true,
    },
    hash_password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

userSchema.virtual("displayName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compare(password, this.hash_password);
  },
};

module.exports = mongoose.model("User", userSchema);
