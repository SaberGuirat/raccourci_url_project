const Url = require("../models/Url");
const shortid = require("shortid");
const { validURL } = require("../utils/utils.js");

const urlCtrl = {
  createShortUrl: async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = process.env.BASE_URL;

    // Check long url is valid url
    if (!validURL(longUrl)) {
      return res.status(400).json({ msg: "Invalid  url" });
    } else {
      // Create url code
      const urlCode = shortid.generate();
      try {
        const url = await Url.findOne({ longUrl });

        if (url) {
          res.status(200).json(url);
        } else {
          const shortUrl = baseUrl + "/" + urlCode;
          const newUrl = new Url({
            user_id: req.user._id,
            longUrl,
            shortUrl,
            urlCode,
          });
          await newUrl.save();
          res.status(200).json(newUrl);
        }
      } catch (err) {
        return res.status(500).json({ msg: err.message });
      }
    }
  },
  visitUrl: async (req, res) => {
    try {
      const { code } = req.params;
      let url = await Url.findOne({ urlCode: code, user_id: req.user._id });
      //check if the url exist in DB
      if (!url) return res.status(404).json({ msg: " 404 Url not found" });

      // if exist
      url.visited++;
      await url.save();
      res.status(200).json(url);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getUserUrls: async (req, res) => {
    try {
      const urls = await Url.find({ user_id: req.user._id });
      if (!urls.length) {
        return res
          .status(404)
          .json({ msg: " you don't have any generated urls yet !" });
      }
      return res.status(200).json(urls);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUrl: async (req, res) => {
    try {
      const { id } = req.params;
      const url = await Url.findByIdAndDelete({ _id: id });
      if (!url)
        return res.status(400).json({ msg: "Something went wrong ..." });
      res.status(200).json(url);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = urlCtrl;
