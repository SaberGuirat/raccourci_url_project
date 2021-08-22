const router = require("express").Router();
const authCtrl = require("../controllers/user.controller");

router.post("/register", authCtrl.register);

router.post("/login", authCtrl.login);

router.post("/refresh_token", authCtrl.refreshAccessToken);

module.exports = router;
