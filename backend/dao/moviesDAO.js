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
}
