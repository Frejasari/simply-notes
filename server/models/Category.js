const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, "A category name is required"] },
    color: { type: String, default: "#8FA69C" },
    _owner: { type: Schema.Types.ObjectId, ref: "User", required: "An owner is required" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updatedAt" } }
);

module.exports = mongoose.model("Category", categorySchema);
