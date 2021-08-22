const router = require("express").Router();
const urlCtrl = require("../controllers/url.controller");

//import authentication middleware to check if the user is authenticated to proceed the requests
const auth = require("../middlewares/auth");

// Create short URL api route
router.post("/short", auth, urlCtrl.createShortUrl);

// get generated url to visit
router.get("/visit/:code", auth, urlCtrl.visitUrl);

// get all user url
router.get("/all", auth, urlCtrl.getUserUrls);

//delete by id
router.delete("/delete/:id", urlCtrl.deleteUrl);

module.exports = router;
