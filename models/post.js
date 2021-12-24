const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PostSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  post: {
    type: String,
    require: true,
  },

  title: {
    type: String,
    required: true,
  },
  tags: [],
  createdAt: { type: Date },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Post", PostSchema);
