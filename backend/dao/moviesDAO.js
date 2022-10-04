import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let movies;

// data access object
export default class MoviesDAO {
	static async injectDB(conn) {
		if (movies) {
			return;
		}
		try {
			movies = await conn.db(process.env.MOVIEREVIEWS_NS).collection("movies");
		} catch (e) {
			console.error(`unable to connect in MoviesDAO: ${e}`);
		}
	}

	// retrieving movies
	static async getMovies({
		//default filter
		filters = null, //no filters
		page = 0, //retrieves results at page 0
		moviesPerPage = 20, //only get 20 movies at once
	} = {}) {
		let query;
		if (filters) {
			if ("title" in filters) {
				query = { $text: { $search: filters["title"] } };
			} else if ("rated" in filters) {
				query = { rated: filters["rated"] };
			}
		}
		let cursor;
		try {
			cursor = await movies
				.find(query)
				.limit(moviesPerPage)
				.skip(moviesPerPage * page);
			const moviesList = await cursor.toArray();
			const totalNumMovies = await movies.countDocuments(query);
			return { moviesList, totalNumMovies };
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return { moviesList: [], totalNumMovies: 0 };
		}
	}

	// get ratings
	static async getRatings() {
		let ratings = [];
		try {
			ratings = await movies.distinct("rated");
			return ratings;
		} catch (e) {
			console.error(`unable to get ratings, $(e)`);
			return ratings;
		}
	}
	// get a single movie by using id passed from controller
	static async getMovieById(id) {
		try {
			return await movies
				.aggregate([
					{
						$match: {
							_id: new ObjectId(id),
						},
					},
					{
						$lookup: {
							from: "reviews",
							localField: "_id",
							foreignField: "movie_id",
							as: "reviews",
						},
					},
				])
				.next();
		} catch (e) {
			console.error(`something went wrong in getMovieById: ${e}`);
			throw e;
		}
	}
}
