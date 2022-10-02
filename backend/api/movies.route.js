import express from "express";
import MoviesController from "./movies.controller.js";
import ReviewsController from "./reviews.controller.js";

const router = express.Router(); // get access to express router
router.route("/").get(MoviesController.apiGetMovies);
// router.route("/").get((req, res) => res.send("hello from movie route"));
router
	.route("/review")
	// to post review
	.post(ReviewsController.apiPostReview)
	// to edit review
	.put(ReviewsController.apiUpdateReview)
	// to delete review
	.delete(ReviewsController.apiDeleteReview);

export default router;
