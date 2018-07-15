const Notebook = require("./models/Notebook");
const Category = require("./models/Category");

module.exports = {
  findOneNotebookWithAccessThroughId: (notebookId, userId) =>
    Notebook.findOne({ $and: [{ _id: notebookId }, { _collaborators: userId }] }),

  findOneNotebookWithAccessThroughIdAndUpdate: (notebookId, userId, updatedUser) =>
    Notebook.findOneAndUpdate({ $and: [{ _owner: userId }, { _id: notebookId }] }, updatedUser, { new: true }),

  findOneNotebookWithAccessThroughSiteId: (siteId, userId) =>
    Notebook.findOne({ $and: [{ _sites: siteId }, { _collaborators: userId }] }),

  findOneCategoryWithAccessAndUpdate: (categoryId, userId, updatedCategory) =>
    Category.findOneAndUpdate({ $and: [{ _id: categoryId, _owner: userId }] }, updatedCategory, { new: true }),

  findOneCategoryWithAccessAndDelete: (categoryId, userId) =>
    Category.findOneAndRemove({ $and: [{ _id: categoryId, _owner: userId }] })
};
