const Post = require("../models/post");

exports.getPosts = (req, res) => {
  const { tag, page, perPage } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(perPage, 10),
  };

  if (tag) {
    Post.paginate({ tags: { $all: [...tag] } }, options)
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    Post.paginate({}, options)
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
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
