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
    _categories: []
  },
  {
    name: "Lisa",
    email: "lisa.testuser@abc.de",
    password: "abcd",
    imgUrl: "/images/default-silhouette.jpg"
  },
  {
    name: "Meg",
    email: "meg.testuser@abc.de",
    password: "abcd",
    imgUrl: "/images/default-silhouette.jpg"
  }
];
//#endregion

//#region Notebooks
const notebooks = [
  { title: "Ironhack", description: "Notebook about my Ironhack Coding Bootcamp experience", _sites: [] }
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
  { name: "Express" },
  { name: "Hbs" },
  { name: "Node.js" },
  { name: "Terminal" },
  { name: "Mongoose" },
  { name: "The Internet" }
];
//#endregion

//#region seed everything
Promise.all([
  User.deleteMany(),
  Notebook.deleteMany(),
  Site.deleteMany(),
  Paragraph.deleteMany(),
  Category.deleteMany()
])
  .then(_ => Category.create(categories))
  .then(categories => {
    console.log("Categories seeded!");
    categories.forEach((categorie, j) => {
      users[0]._categories.push(categorie._id);
      paragraphs.forEach((paragraph, i) => {
        if (j === 0 && i !== 1) paragraph._categories.push(categorie._id);
        if (i % 3 && j === 3 && i !== 1) paragraph._categories.push(categorie._id);
        else if (i % 2 && j % 2) paragraph._categories.push(categorie._id);
      });
    });
    console.log("Categories added to paragraphs");
  })
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
    let dBUserId1 = users[0]._id;
    notebooks.forEach(notebook => (notebook._owner = dBUserId1));
    sites.forEach(site => (site._owner = dBUserId1));
    paragraphs.forEach(paragraph => (paragraph._owner = dBUserId1));
    return Paragraph.create(paragraphs);
  })
  .then(paragraphs => {
    console.log("Paragraphs seeded");
    for (let i = 0; i < paragraphs.length; i += 3) {
      sites[0]._paragraphs.push(paragraphs[i]);
      if (paragraphs[i + 1]) sites[1]._paragraphs.push(paragraphs[i + 1]);
      if (paragraphs[i + 2]) sites[2]._paragraphs.push(paragraphs[i + 2]);
    }
  })
  .then(_ => Site.create(sites))
  .then(dBSites => {
    console.log("Sites seeded");
    dBSites.forEach(site => {
      notebooks[0]._sites.push(site._id);
    });
    console.log("Site Ids added to notebook");
  })
  .then(_ => Notebook.create(notebooks).then(notebooks => {}))
  .then(_ => {
    console.log("Notebooks seeded");
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
