import axios from "axios";
import { puts } from "util";

const service = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3030/api"
});

const errHandler = err => {
  console.error(err);
  throw err;
};

export default {
  service: service,

  //#region notebooks
  getNotebooks() {
    return service
      .get("/notebooks")
      .then(res => res.data)
      .catch(errHandler);
  },

  getNotebook(notebookId) {
    return service
      .get(`/notebooks/${notebookId}`)
      .then(res => res.data)
      .catch(errHandler);
  },

  editNotebook(notebookId, data) {
    return service
      .put(`/notebooks/${notebookId}`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  createNotebooks(data) {
    return service
      .post("/notebooks", data)
      .then(res => res.data)
      .catch(errHandler);
  },
  //#endregion

  //#region Pages
  getPage(pageId) {
    return service
      .get(`/notebooks/sites/${pageId}`)
      .then(res => res.data)
      .catch(errHandler);
  },

  createPage(notebookId, data) {
    return service
      .post(`/notebooks/${notebookId}/sites`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  editPage(pageId, data) {
    return service
      .put(`/notebooks/sites/${pageId}`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  deletePage(pageId) {
    return service
      .delete(`/notebooks/sites/${pageId}`)
      .then(res => res.data)
      .catch(errHandler);
  },
  //#endregion

  //#region Paragraphs

  createParagraph(pageId, data) {
    return service
      .post(`/notebooks/${pageId}/paragraphs`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  editParagraph(pageId, paragraphId, data) {
    return service
      .put(`/notebooks/${pageId}/paragraphs/${paragraphId}`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  deleteParagraph(pageId, paragraphId) {
    return service
      .delete(`/notebooks/${pageId}/paragraphs/${paragraphId}`)
      .then(res => res.data)
      .catch(errHandler);
  },
  //#endregion

  //#region categories
  getCategories() {
    return service
      .get("/categories")
      .then(res => res.data)
      .catch(errHandler);
  },

  createCategory(data) {
    return service
      .post("/categories", data)
      .then(res => res.data)
      .catch(errHandler);
  },

  editCategory(categoryId, data) {
    return service
      .put(`/categories/${categoryId}`, data)
      .then(res => res.data)
      .catch(errHandler);
  },

  deleteCategory(categoryId) {
    return service
      .delete(`/categories/${categoryId}`)
      .then(res => res.data)
      .catch(errHandler);
  },

  //#endregion

  getSecret() {
    return service
      .get("/secret")
      .then(res => res.data)
      .catch(errHandler);
  },

  //#region Authentication & Authorization
  signup(userInfo) {
    return service
      .post("/signup", userInfo)
      .then(res => res.data)
      .catch(errHandler);
  },

  login(email, password) {
    return service
      .post("/login", {
        email,
        password
      })
      .then(res => {
        console.log("DEBUG res", res);
        const { data } = res;
        localStorage.setItem("user", JSON.stringify(data));
        axios.defaults.headers.common["Authorization"] = "Bearer " + data.token;
        return data;
      })
      .catch(errHandler);
  },

  logout() {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("user");
  },

  loadUser() {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    const user = JSON.parse(userData);
    if (user.token && user.name) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
      return user;
    }
    return false;
  },

  isLoggedIn() {
    return localStorage.getItem("user") != null;
  }
  //#endregion
};
