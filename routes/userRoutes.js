const express = require("express");
const { registerUser } = require("../controllers/userController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", (req, res) => {
  res.json({ message: "Login user" });
});

router.get("/current", (req, res) => {
  res.json({ message: "Current user" });
});

module.exports = router;
