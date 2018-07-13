const mongoose = require("mongoose");
const { Schema } = mongoose;

const notebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A notebook title is required"]
  },
  description: {
    type: String
  },
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  _sites: [{ type: Schema.Types.ObjectId, ref: "Site" }],
  _collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Notebook", notebookSchema);
