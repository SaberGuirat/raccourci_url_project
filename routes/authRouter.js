const router = require("express").Router();
const authCtrl = require("../controllers/user.controller");

// register route
router.post("/register", authCtrl.register);

//login route
router.post("/login", authCtrl.login);

// refresh token route
router.post("/refresh_token", authCtrl.refreshAccessToken);

module.exports = router;
