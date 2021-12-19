const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const {
  createPost,
  getPosts,
  getPostById,
} = require("../../controllers/admin/managerPost");
const router = express.Router();

router.post("/create", requireSignin, adminMiddleware, createPost);

router.get("/", requireSignin, adminMiddleware, getPosts);

router.get("/:postId", requireSignin, adminMiddleware, getPostById);

module.exports = router;
