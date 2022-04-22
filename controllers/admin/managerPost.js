const Post = require("../../models/post");

exports.createPost = (req, res) => {
  const { postContent, postTitle, tags, avatar } = req.body;

  const post = new Post({
    avatar,
    title: postTitle,
    post: postContent,
    tags,
    createdAt: new Date(),
    createdBy: req.user._id,
  });

  post.save((err, post) => {
    if (err) return res.status(400).json({ err });
    if (post) return res.status(201).json({ post });
  });
};

exports.getPosts = (req, res) => {
  Post.find({})
    .sort({ createdAt: -1 })
    .populate("createdBy")
    .exec((error, posts) => {
      if (error) return res.status(400).json({ error });
      if (posts) return res.status(200).json({ posts });
    });
};

exports.getPostById = (req, res) => {
  const { postId } = req.params;
  if (postId) {
    Post.findOne({ _id: postId }).exec((error, post) => {
      if (error) return res.status(400).json({ error });
      if (post) return res.status(200).json({ post });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

exports.updatePost = (req, res) => {
  const { updatePost } = req.body;

  Post.findOneAndUpdate({ _id: updatePost.postId }, updatePost, {
    new: true,
  }).exec((error, post) => {
    if (error) return res.status(400).json({ error });
    if (post) return res.status(201).json({ post });
  });
};
exports.deletePost = (req, res) => {
  const { postId } = req.params;

  Post.findOneAndDelete({ _id: postId }).exec((error, post) => {
    if (error) return res.status(400).json({ error });
    if (post)
      return res.status(202).json({ message: "Successful update post" });
  });
};
