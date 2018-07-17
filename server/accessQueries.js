const Notebook = require("./models/Notebook");
const Site = require("./models/Site");
const Category = require("./models/Category");

module.exports = {
  findOneNotebookWithAccessThroughId: (notebookId, userId) =>
    Notebook.findOne({ $and: [{ _id: notebookId }, { _collaborators: userId }] }),

  findOneNotebookWithAccessThroughIdAndUpdate: (notebookId, userId, updatedUser) =>
    Notebook.findOneAndUpdate({ $and: [{ _owner: userId }, { _id: notebookId }] }, updatedUser, { new: true }),

  findOneNotebookWithAccessThroughSiteId: (siteId, userId) =>
    Notebook.findOne({ $and: [{ _sites: siteId }, { _collaborators: userId }] }),

  findOneNotebookWithAccessThroughPId: function(pId, userId) {
    return Site.findOne({ _paragraphs: pId }).then(site => {
      if (!site) next("Error, page Id does not exist");
      else return this.findOneNotebookWithAccessThroughSiteId(site._id, userId);
    });
  },
  findOneCategoryWithAccessAndUpdate: (categoryId, userId, updatedCategory) =>
    Category.findOneAndUpdate({ $and: [{ _id: categoryId, _owner: userId }] }, updatedCategory, { new: true }),

  findOneCategoryWithAccessAndDelete: (categoryId, userId) =>
    Category.findOneAndRemove({ $and: [{ _id: categoryId, _owner: userId }] })
};
