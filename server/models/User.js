const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: [true, "A name is required"] },
  // email: { type: String, required: true }, // Defined with passportLocalMongoose
  // password: { type: String, required: true },
  // hashed: String, // Defined with passportLocalMongoose
  // salt: String, // Defined with passportLocalMongoose
  pictureUrl: String,
  _notebooks: [{ type: Schema.Types.ObjectId, ref: "Notebook" }],
  _categories: [{ type: Schema.Types.ObjectId, ref: "Category" }]
});

// Add "email" (instead of "username"), "hash" and "salt" field to store the email (as username), the hashed password and the salt value
// Documentation: https://github.com/saintedlama/passport-local-mongoose
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
