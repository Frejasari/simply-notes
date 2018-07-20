var express = require("express");
const Category = require("../models/Category");
const Paragraph = require("../models/Paragraph");
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

//#region GET all Paragraphs with category
router.get("/:categoryId/paragraphs", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  console.log("Get all paragraphs called");
  let currCategory = null;
  Category.findOne({ _id: req.params.categoryId, _owner: req.user._id })
    .then(category => {
      if (!category) next("Error, no category or not rights");
      else {
        currCategory = category;
        return Paragraph.find({ _categories: req.params.categoryId }).populate("_categories");
      }
    })
    .then(paragraphs => {
      if (!paragraphs) next("Error, no paragraphs with category found");
      else res.json({ success: true, paragraphs, category: currCategory });
    });
});
//#endregion

//#region POST categories
router.post("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  Category.create({ _owner: req.user._id, name: req.body.name, color: req.body.color })
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
    .findOneCategoryWithAccessAndUpdate(req.params.categoryId, req.user._id, {
      name: req.body.name,
      color: req.body.color
    })
    .then(category => {
      if (!category) next("Error, category could not be updated, no access or category does not exist");
      else return getAndShowCategoriesOfUser(req.user._id, res);
    })
    .catch(err => next(err));
});
//#endregion

//#region DELETE categories/categoryId
router.delete("/:categoryId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneCategoryWithAccessAndDelete(req.params.categoryId, req.user._id)
    .then(category => {
      if (!category) next("Error, category could not be deleted, no access or category does not exist");
      else return getAndShowCategoriesOfUser(req.user._id, res);
    })
    .then(result => console.log("RESULT OF getAndShowCategories", result))
    .catch(err => next(err));
});
//#endregion

const getAndShowCategoriesOfUser = (userId, res) => {
  return Category.find({ _owner: userId })
    .select("name color")
    .then(categories => {
      if (!categories) next("Error, categories not found");
      else res.json({ success: true, categories });
    });
};

module.exports = router;
