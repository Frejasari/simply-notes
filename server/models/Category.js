const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: [true, "A category name is required"] }
  // ,_paragraphs:  [{type: Schema.Types.ObjectId, ref:"Paragraph"}]
});

module.exports = mongoose.model("Category", categorySchema);
