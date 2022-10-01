import express from "express";
import MoviesController from "./movies.controller.js";

const router = express.Router(); // get access to express router
router.route("/").get(MoviesController.apiGetMovies)
// router.route("/").get((req, res) => res.send("hello from movie route"));
export default router;
