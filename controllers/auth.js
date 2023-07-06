const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });

  const token = user.createJWT(); // mongoose instance method

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, userId: user._id }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  const token = user.createJWT();

  // res.cookie("token", token, {
  //   httpOnly: true,
  //   sameSite: "None",
  //   secure: true,
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, userId: user._id }, token });
};

const setNewPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Missing information to reset password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid credentials" });
  }

  user.password = password;
  await user.save();
  return res.status(StatusCodes.OK).json({ message: "Password reset" });
};

module.exports = { register, login, setNewPassword };
