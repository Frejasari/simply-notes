var express = require("express");
const Category = require("../models/Category");
const passport = require("passport");
const config = require("../config");
const accessQueries = require("../accessQueries");

var router = express.Router();

//#region GET categories
router.get("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  Category.find({ _owner: req.user._id })
    .then(categories => {
      if (!categories) next("Error, no categories found");
      else res.json(categories);
    })
    .catch(err => next(err));
});
//#endregion

module.exports = router;
