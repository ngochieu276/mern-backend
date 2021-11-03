const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ message: "hi" });
});
router.get("/userplaces", async (req, res) => {
  res.json({ message: "userplace" });
});

module.exports = router;
