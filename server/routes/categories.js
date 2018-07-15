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

//#region POST categories
router.post("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  Category.create({ _owner: req.user._id, name: req.body.name })
    .then(category => {
      if (!category) next("Error, category could not be created");
      else getAndShowCategoriesOfUser(req.user._id, res);
    })
    .catch(err => next(err));
});
//#endregion

//#region PUT categories/:categoryId
router.put("/:categoryId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneCategoryWithAccessAndUpdate(req.params.categoryId, req.user._id, { name: req.body.name })
    .then(category => {
      if (!category) next("Error, category could not be updated, no access or category does not exist");
      else return res.json(category);
    })
    .catch(err => next(err));
});
//#endregion

const getAndShowCategoriesOfUser = (userId, res) => {
  return Category.find({ _owner: userId })
    .select("name")
    .then(categories => {
      if (!categories) next("Error, categories not found");
      else res.json(categories);
    });
};

module.exports = router;
