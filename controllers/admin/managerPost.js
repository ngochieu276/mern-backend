const Post = require("../../models/post");

exports.createPost = (req, res) => {
  const { postContent, postTitle } = req.body;

  const post = new Post({
    title: postTitle,
    post: postContent,
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
    .populate("createdBy")
    .exec((error, posts) => {
      if (error) return res.status(400).json({ error });
      if (posts) return res.status(200).json({ posts });
    });
};

exports.getPostById = (req, res) => {
  const { postId } = req.params;
  if (postId) {
    Product.findOne({ _id: postId }).exec((error, post) => {
      if (error) return res.status(400).json({ error });
      if (post) return res.status(200).json({ post });
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
