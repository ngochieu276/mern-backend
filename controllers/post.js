const Post = require("../models/post");

exports.getPosts = (req, res) => {
  const { tag, page, perPage } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(perPage, 10),
    populate: "createdBy",
  };

  if (tag) {
    if (Array.isArray(tag)) {
      Post.paginate(
        {
          $or: [
            { tags: { $all: [...tag] } },
            { tags: { $in: tag[0] } },
            { tags: { $in: tag[1] } },
          ],
        },
        options
      )
        .then((posts) => {
          res.status(200).json(posts);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Post.paginate(
        {
          tags: { $in: tag },
        },
        options
      )
        .then((posts) => {
          res.status(200).json(posts);
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
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
    Post.findOne({ _id: postId })
      .populate("createdBy")
      .exec((error, post) => {
        if (error) return res.status(400).json({ error });
        if (post) return res.status(200).json({ post });
      });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
