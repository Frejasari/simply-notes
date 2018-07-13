const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, "A category name is required"] },
    _owner: { type: Schema.Types.ObjectId, ref: "User", required: "An owner is required" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Category", categorySchema);
