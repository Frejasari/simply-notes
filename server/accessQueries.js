const Notebook = require("./models/Notebook");

module.exports = {
  findOneNotebookWithAccessThroughId: (notebookId, userId) =>
    Notebook.findOne({ $and: [{ _id: notebookId }, { _collaborators: userId }] }),

  findOneNotebookWithAccessThroughSiteId: (siteId, userId) =>
    Notebook.findOne({ $and: [{ _sites: siteId }, { _collaborators: userId }] })
};
