const mongoose = require("mongoose");
const { Schema } = mongoose;

const siteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: Date.now()
    },
    description: {
      type: String
    },
    _paragraphs: [{ type: Schema.Types.ObjectId, ref: "Paragraph" }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Site", siteSchema);
