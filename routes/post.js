const express = require("express");
const { getPostById, getPosts } = require("../controllers/post");

const router = express.Router();
router.get("/", getPosts);
router.get("/:postId", getPostById);

module.exports = router;
