var express = require("express");
const Notebook = require("../models/Notebook");
const passport = require("passport");
const config = require("../config");

var router = express.Router();

// Route to get all notebooks of the user
router.get("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  // TODO : get the user from local variable to access the current user! and find all notebooks of this user.
  console.log("ROUTER GET NOTEBOOKS CALLED, REWORK!!!! Only access notebooks of the current user!!");
  Notebook.find()
    .then(notebooks => {
      res.json(notebooks);
    })
    .catch(err => next(err));
});

router.get("/:notebookId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  console.log("ROUTER GET NOTEBOOKID CALLED");
  // TODO: check that the notebook is accessible to the user !! (so she is the owner / collaborator )
  const user = req.user;
  Notebook.findById(req.params.notebookId)
    .then(notebook => {
      if (notebook._collaborators.includes(user._id)) {
        res.json(notebook);
      } else res.redirect("/error");
    })
    .catch(err => next(err));
});

router.get("/error", (req, res, next) => {
  res.json(error);
});

// Route to add a notebook
router.post("/", (req, res, next) => {
  let { title, description } = req.body;
  // TODO: push curr user in
  Notebook.create({ title, description })
    .then(notebook => {
      res.json({
        success: true,
        notebook
      });
    })
    .catch(err => next(err));
});

module.exports = router;
