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

//#region PUT Notebooks/:notebookId
router.put("/:notebookId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  const { title, description, _collaborators } = req.body;
  accessQueries
    .findOneNotebookWithAccessThroughIdAndUpdate(req.params.notebookId, req.user._id, {
      title,
      description,
      _collaborators
    })
    .then(notebook => {
      if (!notebook)
        res.json("ERROR, notebook could not be updated, either you're not authorized or there's no such notebook");
      else
        res.json({
          success: true,
          notebook
        });
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

// SITES

//#region GET get Notebooks/sites/:siteId
router.get("/sites/:siteId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.siteId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR no rights or no site");
      else
        return Site.findById(req.params.siteId)
          .populate("_paragraphs")
          .then(site => {
            if (!site) next("ERROR no site");
            else res.json(site);
          });
    })
    .catch(err => next(err));
});
//#endregion

//#region POST Notebooks/:notebookId/sites/
router.post("/:notebookId/sites", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughId(req.params.notebookId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR, no rights or no notebook");
      else {
        const { name, description } = req.body;
        Site.create({ name, description })
          .then(site => {
            if (!site) next("Error, page could not be created");
            else {
              res.json(site);
              notebook._sites.push(site._id);
              return notebook.save();
            }
          })
          .then(notebook => {
            if (!notebook) next("Error, notebook could not be updated");
            // TODO: now?
            else console.log("Notebook updated and saved!");
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});
//#endregion

//#region PUT Notebooks/sites/:siteId
router.put("/sites/:siteId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.siteId, req.user._id)
    .then(notebook => {
      if (!notebook) next("ERROR, no rights or no notebook");
      else {
        const { name, description } = req.body;
        Site.findByIdAndUpdate(req.params.siteId, { name, description }, { new: true })
          .then(site => {
            if (!site) next("Error, site could not be created");
            else {
              res.json(site);
              notebook._sites.push(site._id);
              return notebook.save();
            }
          })
          .then(notebook => {
            if (!notebook) next("Error, notebook could not get saved");
            else console.log("Notebook updated and saved");
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});
//#endregion

//#region DELETE Notebooks/sites/:siteId
router.delete("/sites/:pageId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .populate("_sites")
    .then(notebook => {
      if (!notebook) next("Error, no rights or no site");
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
      else res.json(notebook);
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
      else
        return Site.findByIdAndUpdate(
          req.params.pageId,
          { $push: { _paragraphs: paragraph._id } },
          { new: true }
        ).populate("_paragraphs");
    })
    .then(page => {
      if (!page) next("Error, page could not be updated");
      else res.json(page);
    })
    .catch(err => next(err));
});
//#endregion

//#region PUT PARAGRAPH Notebooks/:pageId/paragraphs/:paragraphId
router.put("/:pageId/paragraphs/:paragraphId", passport.authenticate("jwt", config.jwtSession), (req, res, next) => {
  accessQueries
    .findOneNotebookWithAccessThroughSiteId(req.params.pageId, req.user._id)
    .then(notebook => {
      if (!notebook) next("Error, no access to page or wrong id");
      else {
        const { text, _categories } = req.body;
        return Paragraph.findByIdAndUpdate(req.params.paragraphId, { text, _categories }, { new: true });
      }
    })
    .then(paragraph => {
      if (!paragraph) next("Error, paragraph could not be updated");
      else return Site.findById(req.params.pageId).populate("_paragraphs");
    })
    .then(page => {
      if (!page) next("Error, page could not be updated");
      else res.json(page);
    })
    .catch(err => next(err));
});
//#endregion

module.exports = router;
