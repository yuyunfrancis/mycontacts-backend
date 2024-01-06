const asyncHandler = require("express-async-handler");

//@desc register a user
//@route GET /api/vi/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  res.json({ message: "Register user" });
});

const loginUser = (req, res) => {
  res.json({ message: "Login user" });
};

module.exports = { registerUser, loginUser };
