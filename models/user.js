const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      trim: true,
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      require: true,
      trim: true,
      min: 3,
      max: 20,
    },
    userName: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
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
    },
    phone: {
      type: String,
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
    receivedEmail: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
    },
    isMng: {
      type: Boolean,
      default: false,
    },
    vouchers: [
      {
        type: {
          type: String,
          enum: ["discount5", "discount10", "discount15"],
        },
        date: {
          type: Date,
        },
        isUsed: {
          type: Boolean,
          default: false,
        },
      },
    ],
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
