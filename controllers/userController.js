const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//@desc register a user
//@route POST /api/vi/users/register
//@access public

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email } || { username });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log(`User created ${user}`);

  if (user) {
    res
      .status(201)
      .json({ status: "success", data: { _id: user.id, email: user.email } });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
});

//@desc login user
//@route POST /api/vi/users/LOGIN
//@access public

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Username and password required");
  }

  const user = await User.findOne({ email });

  // compare password with hashedpassword
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ status: "success", accessToken });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc current user
//@route GET /api/vi/users
//@access private

const currentUser = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, currentUser };
