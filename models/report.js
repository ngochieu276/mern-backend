const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    isChecked: {
      type: Boolean,
    },
    field: {
      type: String,
    },
    content: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
