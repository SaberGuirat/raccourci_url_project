const Users = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// generate access token
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

// generate refresh token
const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

// auth controller
const authCtrl = {
  register: async (req, res) => {
    try {
      const { fullname, email, password } = req.body;
      const user_email = await Users.findOne({ email });
      if (user_email)
        return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password must be at least 6 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullname,
        email,
        password: passwordHash,
      });
      await newUser.save();

      res.status(200).json({
        msg: "Register Success!",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      // .populate(
      //   "followers following",
      //   "avatar username fullname followers following"
      // );

      if (!user)
        return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });

      const access_token = createAccessToken({ id: user._id });
      const refresh_token = createRefreshToken({ id: user._id });

      res.status(200).json({
        msg: "Login Success!",
        refresh_token,
        access_token,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshAccessToken: async (req, res) => {
    try {
      const rf_token = req.body.refresh_token;

      if (!rf_token) return res.status(400).json({ msg: "Please login now." });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) return res.status(400).json({ msg: "Please login now." });

          const user = await Users.findById(result.id).select("-password");
          // .populate(
          //   "followers following",
          //   "avatar username fullname followers following"
          // );

          if (!user)
            return res.status(400).json({ msg: "This user does not exist." });

          const access_token = createAccessToken({ id: result.id });
          res.status(200).json({
            access_token,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
          });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = authCtrl;
