const mongoose = require("mongoose");
const { Schema } = mongoose;

const paragraphSchema = new Schema(
  {
    text: { type: String, required: [true, "A paragraph cannot be empty"] },
    _categories: { type: [{ type: Schema.Types.ObjectId, ref: "Category" }], default: [] }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Paragraph", paragraphSchema);
