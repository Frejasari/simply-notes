"use strict";
require("dotenv").config();

const mongoose = require("mongoose");
const dbName = "simple-notes";
// const mongoUri = `mongodb://localhost/${dbName}`;
console.log("MONGO URI", process.env.MONGODB_URI);
const mongoUri = process.env.MONGODB_URI || `mongodb://localhost/${dbName}`;

// connect to the database
mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log(`Connected to the database (${mongoUri})`);
});
