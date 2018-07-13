const Notebook = require("./models/Notebook");

module.exports = {
  findOneNotebookWithAccessThroughId: (notebookId, userId) =>
    Notebook.findOne({ $and: [{ _id: notebookId }, { _collaborators: userId }] }),

  findOneNotebookWithAccessThroughIdAndUpdate: (notebookId, userId, updatedUser) =>
    Notebook.findOneAndUpdate({ $and: [{ _owner: userId }, { _id: notebookId }] }, updatedUser, { new: true }),

  findOneNotebookWithAccessThroughSiteId: (siteId, userId) =>
    Notebook.findOne({ $and: [{ _sites: siteId }, { _collaborators: userId }] })
};
