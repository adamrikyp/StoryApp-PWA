// src/scripts/routes/routes.js

import HomePage from "../views/home/home-page.js";
import AboutPage from "../views/about/about-page.js";
import AddStoryPage from "../views/add/add-story-page.js";
import LoginPage from "../views/auth/login-page.js";
import RegisterPage from "../views/auth/register-page.js";
import DetailPage from "../views/detail/detail-page.js";
import FavoritePage from "../views/favorite/favorite-page.js";

const routes = {
  "/": HomePage, // Jangan new HomePage()
  "/about": AboutPage,
  "/add": AddStoryPage,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/detail/:id": DetailPage,
  "/favorit": FavoritePage,
};

export default routes;
