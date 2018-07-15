// connect to the database:
require("../configs/database");
const mongoose = require("mongoose");

const User = require("../models/User");
const Notebook = require("../models/Notebook");
const Site = require("../models/Site");
const Paragraph = require("../models/Paragraph");
const Category = require("../models/Category");

//#region User
const users = [
  {
    name: "Anna",
    email: "anna.testuser@abc.de",
    password: "abcd",
    imgUrl: "/images/default-silhouette.jpg",
    notebooks: []
  },
  {
    name: "Lisa",
    email: "lisa.testuser@abc.de",
    password: "abcd",
    imgUrl: "/images/default-silhouette.jpg",
    notebooks: []
  },
  {
    name: "Meg",
    email: "meg.testuser@abc.de",
    password: "abcd",
    imgUrl: "/images/default-silhouette.jpg",
    notebooks: []
  }
];
//#endregion

//#region Notebooks
const notebooks = [
  {
    title: "Ironhack",
    description: "Notebook about my Ironhack Coding Bootcamp experience",
    _sites: [],
    _owner: null,
    _collaborators: []
  }
];
//#endregion

//#region Site

const sites = [
  {
    name: "Module 1 - Frontend",
    description: "2 Weeks learning Frontend Development using HTML, CSS, Bootstrap, JS, jQuery",
    _paragraphs: []
  },
  {
    name: "Module 2 - Backend",
    description:
      "2 Weeks learning Backend Development using express, node.js, hbs, passport and many other npm packages",
    _paragraphs: []
  },
  {
    name: "Module 3 - React",
    description:
      "3rd module of the bootcamp, frontend again - how to build a fullstack application using the React.js framework",
    _paragraphs: []
  }
];
//#endregion

//#region Paragraph
const paragraphs = [
  { _categories: [], text: "Frontend: Application => React => Browser => Client Machine" },
  { _categories: [], text: "The MERN Stack: MongoDB, Express, React, Node.js" },
  { _categories: [], text: "Frontend: Application => React => Browser => Client Machine" },
  { _categories: [], text: "Backend: MongoDB Driver => MongoDB => Node.js => Backend Server" },
  { _categories: [], text: "API => App => Express => Node.js => Backend Server" },
  { _categories: [], text: "FOLLOWING 3 FRONTEND FRAMEWORKS HAVE THE SAME KIND OF ARCHITECTURE AND USE THE SAME IDEA" },
  { _categories: [], text: "REACT: Frontend framework, with new architecture, developed by Facebook" },
  { _categories: [], text: "Angular 2+: Frontend framework, developed by Google" },
  { _categories: [], text: "Vue.js: Frontend framework, developed by 'normal people'" },
  { _categories: [], text: "- No HBS anymore in the MERN Stack" },
  { _categories: [], text: "- no need to refresh the whole page every small change!" },
  { _categories: [], text: "- only the changed parts of the website are going to be refreshed" },
  { _categories: [], text: "1. install react gloablly" },
  { _categories: [], text: "  [$]> npm install -g create-react-app" },
  { _categories: [], text: "2. create a new react app" },
  { _categories: [], text: "  [$]> create-react-app my-react-app" },
  { _categories: [], text: "3. change folder and run npm start" }
];

//#endregion

//#region  Categories
let categories = [
  { name: "Express", _owner: null },
  { name: "Hbs", _owner: null },
  { name: "Node.js", _owner: null },
  { name: "Terminal", _owner: null },
  { name: "Mongoose", _owner: null },
  { name: "The Internet", _owner: null }
];
//#endregion

//#region seed everything
let firstUserId;
let secondUserId;

Promise.all([
  User.deleteMany(),
  Notebook.deleteMany(),
  Site.deleteMany(),
  Paragraph.deleteMany(),
  Category.deleteMany()
])

  .then(_ => {
    const userPromises = [];
    users.forEach(user => {
      const { name, email, imgUrl, password } = user;
      const newUser = new User({ name, email, imgUrl });
      userPromises.push(User.register(newUser, password));
    });
    return Promise.all(userPromises);
  })
  .then(users => {
    console.log("Users seeded");
    firstUserId = users[0]._id;
    secondUserId = users[1]._id;
    categories.forEach(category => (category._owner = firstUserId));
    notebooks.forEach(
      notebook => ((notebook._owner = firstUserId), notebook._collaborators.push(firstUserId, secondUserId))
    );
    console.log("UserIds added to categories and notebooks");
    return Category.create(categories);
  })
  .then(categories => {
    console.log("Categories seeded!");
    categories.forEach((categorie, j) => {
      paragraphs.forEach((paragraph, i) => {
        if (j === 0 && i !== 1) paragraph._categories.push(categorie._id);
        if (i % 3 && j === 3 && i !== 1) paragraph._categories.push(categorie._id);
        else if (i % 2 && j % 2) paragraph._categories.push(categorie._id);
      });
    });
    console.log("Categories added to paragraphs");

    return User.findByIdAndUpdate(
      firstUserId,
      { _categories: categories.map(category => category._id) },
      { new: true }
    );
  })
  .then(user => {
    console.log("User updated with categories", user);
    return Paragraph.create(paragraphs);
  })
  .then(paragraphs => {
    console.log("Paragraphs seeded");
    for (let i = 0; i < paragraphs.length; i += 3) {
      sites[0]._paragraphs.push(paragraphs[i]);
      if (paragraphs[i + 1]) sites[1]._paragraphs.push(paragraphs[i + 1]);
      if (paragraphs[i + 2]) sites[2]._paragraphs.push(paragraphs[i + 2]);
    }
    console.log("Paragraph Ids added to sites");
  })
  .then(_ => Site.create(sites))
  .then(dBSites => {
    console.log("Sites seeded");
    dBSites.forEach(site => {
      notebooks[0]._sites.push(site._id);
    });
    console.log("Site Ids added to notebook");
  })
  .then(_ => Notebook.create(notebooks))
  .then(notebooks => {
    console.log("Notebooks seeded!");
    const userPromises = [];
    notebooks.forEach(notebook => {
      notebook._collaborators.forEach(collaboratorId => {
        userPromises.push(User.findByIdAndUpdate(collaboratorId, { $push: { _notebooks: notebook._id } }));
      });
    });
    console.log("Notebooks Ids added to collaborators!");
    return Promise.all(userPromises);
  })
  .then(_ => {
    console.log("Collaborators updated!!");
    return mongoose.connection.close();
  })
  .then(_ => {
    console.log("Database closed");
  })
  .catch(err => {
    console.log("error! close Database", err);
    mongoose.connection.close();
  });
//#endregion
