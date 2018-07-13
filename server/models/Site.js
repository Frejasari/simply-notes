const mongoose = require("mongoose");
const { Schema } = mongoose;

const siteSchema = new mongoose.Schema({
  name: {
    type: String,
    default: Date.now()
  },
  description: {
    type: String
  },
  _paragraphs: {
    type: [Schema.Types.ObjectId]
  },
  _owner: { type: Schema.Types.ObjectId, ref: "User" },
  _collaborators: [{ type: Schema.Types.ObjectId, ref: "Uer" }]
});

module.exports = mongoose.model("Site", siteSchema);
