const express = require("express");
const { adminMiddleware, requireSignin } = require("../../common-middleware");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../../controllers/admin/managerPost");
const router = express.Router();

router.put("/update", requireSignin, adminMiddleware, updatePost);

router.post("/create", requireSignin, adminMiddleware, createPost);

router.get("/", requireSignin, adminMiddleware, getPosts);

router.get("/:postId", requireSignin, adminMiddleware, getPostById);

router.delete("/:postId", requireSignin, adminMiddleware, deletePost);

module.exports = router;
