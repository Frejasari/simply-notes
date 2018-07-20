var express = require("express");
const Notebook = require("../models/Notebook");
const Site = require("../models/Site");
const Paragraph = require("../models/Paragraph");
const passport = require("passport");
const config = require("../config");
const accessQueries = require("../accessQueries");

var router = express.Router();

//#region GET Notebooks // GET Notebooks/:NotebookId
// Route to get all notebooks of the user
router.get("/", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
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

//#region PUT Notebooks/:notebookId
router.put("/:notebookId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  const { title, description, _collaborators } = req.body;
  let updatedNotebook = null;
  if (_collaborators) {
    updatedNotebook = { title, description, _collaborators };
  } else {
    updatedNotebook = { title, description };
  }
  accessQueries
    .findOneNotebookWithAccessThroughIdAndUpdate(req.params.notebookId, req.user._id, updatedNotebook)
    .then(notebook => {
      if (!notebook)
        res.json("ERROR, notebook could not be updated, either you're not authorized or there's no such notebook");
      else return Notebook.find({ _collaborators: req.user._id });
    })
    .then(notebooks => {
      if (notebooks) {
        res.json({
          success: true,
          notebooks
        });
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
      else return Notebook.find({ _collaborators: req.user._id });
    })
    .then(notebooks => {
      if (notebooks) res.json({ success: true, notebooks });
      else res.json("ERROR, there's no notebook with this id");
    })
    .catch(err => next(err));
});
//#endregion

// PAGES

//#region GET get Notebooks/:notebookId/pages/:pageId
router.get("/:notebookId/pages/:pageId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR no rights or no page");
      else
        return Site.findById(req.params.pageId)
          .populate({ path: "_paragraphs", populate: { path: "_categories", match: { _owner: req.user._id } } })
          .then(page => {
            if (!page) next("ERROR no page");
            else res.json(page);
          });
    })
    .catch(err => next(err));
});

//#endregion

//#region POST Notebooks/:notebookId/pages/
router.post("/:notebookId/pages", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughId(req.params.notebookId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR, no rights or no notebook");
      else {
        const { title, description } = req.body;
        Site.create({ title, description })
          .then(page => {
            if (!page) next("Error, page could not be created");
            else {
              notebook._sites.push(page._id);
              return notebook.save();
            }
          })
          .then(notebook => {
            if (!notebook) next("Error, notebook could not be updated");
            else return Notebook.findById(notebook._id).populate("_sites");
          })
          .then(notebook => {
            res.json({ success: true, notebook });
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});
//#endregion

//#region PUT Notebooks/pages/:pageId
router.put("/pages/:pageId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR, no rights or no notebook");
      else {
        const { title, description } = req.body;
        Site.findByIdAndUpdate(req.params.pageId, { title, description }, { new: true })
          .populate({ path: "_paragraphs", populate: { path: "_categories", match: { _owner: req.user._id } } })
          .then(page => {
            if (!page) next("Error, site could not be created");
            else {
              return Notebook.findOne({ _sites: req.params.pageId }).populate("_sites");
            }
          })
          .then(newNotebook => {
            if (!newNotebook) next("Error, notebook could not get saved");
            else {
              res.json({ success: true, notebook: newNotebook });
              console.log("Notebook updated and saved", newNotebook);
            }
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});
//#endregion

//#region DELETE Notebooks/pages/:pageId
router.delete("/pages/:pageId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .populate("_sites")
    .then(notebook => {
      if (!notebook) next("Error, no rights or no page");
      else {
        const promises = [Site.findByIdAndRemove(req.params.pageId)];
        const pages = notebook._sites;
        const index = pages.indexOf(req.params.pageId);
        pages.splice(index, 1);
        promises.push(notebook.save());
        return Promise.all(promises);
      }
    })
    .then(([_, notebook]) => {
      if (!notebook) next("Error, page could not be deleted");
      else res.json({ success: true, notebook });
    })
    .catch(err => next(err));
});
//#endregion

// PARAGRAPHS

//#region POST PARAGRAPH Notebooks/:pageId/paragraphs
router.post("/:pageId/paragraphs", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .then(notebook => {
      if (!notebook) next("Error, no access to page or wrong id");
      else {
        const text = req.body.text;
        const _categories = req.body._categories || [];
        return Paragraph.create({ text, _categories });
      }
    })
    .then(paragraph => {
      if (!paragraph) next("Error, paragraph could not be created");
      else {
        return Site.findByIdAndUpdate(
          req.params.pageId,
          { $push: { _paragraphs: { $each: [paragraph._id], $position: req.body.position } } },
          { new: true }
        ).populate({ path: "_paragraphs", populate: { path: "_categories", match: { _owner: req.user._id } } });
      }
    })
    .then(page => {
      if (!page) next("Error, page could not be updated");
      else res.json({ success: true, page });
    })
    .catch(err => next(err));
});
//#endregion

//#region PUT PARAGRAPH Notebooks/paragraphs/:paragraphId
router.put("/paragraphs/:paragraphId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries.findOneNotebookWithAccessThroughPId
    .call(accessQueries, req.params.paragraphId, req.user._id)
    .then(notebook => {
      if (!notebook) next("Error, no access to page or wrong id");
      else {
        const { text, _categories } = req.body;
        if (typeof text === "undefined" && _categories)
          return Paragraph.findByIdAndUpdate(req.params.paragraphId, { _categories }, { new: true });
        if (!_categories && typeof text === "string")
          return Paragraph.findByIdAndUpdate(req.params.paragraphId, { text }, { new: true });
        if (typeof text === "string" && _categories)
          return Paragraph.findByIdAndUpdate(req.params.paragraphId, { text, _categories }, { new: true });
      }
    })
    .then(paragraph => {
      if (!paragraph) next("Error, paragraph could not be updated");
      else
        return Site.findOne({ _paragraphs: req.params.paragraphId }).populate({
          path: "_paragraphs",
          populate: { path: "_categories", match: { _owner: req.user._id }, select: "name color" }
        });
    })
    .then(page => {
      if (!page) next("Error, page could not be updated");
      else res.json({ success: true, page });
    })
    .catch(err => next(err));
});
//#endregion

//#region DELETE PARAGRAPH Notebooks/:pageId/paragraphs/:paragraphId
router.delete("/:pageId/paragraphs/:paragraphId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .then(notebook => {
      if (!notebook) next("Error, no access to page or wrong id");
      else {
        const { text, _categories } = req.body;
        return Paragraph.findByIdAndRemove(req.params.paragraphId);
      }
    })
    .then(paragraph => {
      if (!paragraph) next("Error, paragraph could not be deleted");
      else
        return Site.findByIdAndUpdate(
          req.params.pageId,
          { $pull: { _paragraphs: paragraph._id } },
          { new: true }
        ).populate({ path: "_paragraphs", populate: { path: "_categories", match: { _owner: req.user._id } } });
    })
    .then(page => {
      if (!page) next("Error, page could not be updated");
      else res.json({ success: true, page });
    })
    .catch(err => next(err));
});
//#endregion

//
module.exports = router;
