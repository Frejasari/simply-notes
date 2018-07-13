var express = require("express");
const Notebook = require("../models/Notebook");
const Site = require("../models/Site");
const passport = require("passport");
const config = require("../config");
const accessQueries = require("../accessQueries");

var router = express.Router();

//#region GET Notebooks // GET Notebooks/:NotebookId
// Route to get all notebooks of the user
router.get("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  console.log("ROUTER GET NOTEBOOKS CALLED");
  Notebook.find({ _collaborators: req.user._id })
    .then(notebooks => {
      res.json(notebooks);
    })
    .catch(err => next(err));
});

// Route to get a specific notebook
router.get("/:notebookId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughId(req.params.notebookId, req.user._id)
    .populate("_sites")
    .then(notebook => {
      if (notebook) {
        res.json(notebook);
      } else res.json("ERROR, there's no notebook with this id");
    })
    .catch(err => next(err));
});

router.get("/error", (req, res, next) => {
  res.json(error);
});
//#endregion

//#region POST Notebooks
router.post("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  const { title, description } = req.body;
  Notebook.create({ title, description, _owner: req.user._id, _collaborators: [req.user._id] })
    .then(notebook => {
      if (!notebook) res.json("ERROR, notebook could not be updated");
      else
        res.json({
          success: true,
          notebook
        });
    })
    .catch(err => next(err));
});
//#endregion

module.exports = router;
