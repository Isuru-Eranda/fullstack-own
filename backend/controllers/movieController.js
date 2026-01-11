const Movie = require('../models/Movie');
const { uploadToB2, deleteFromB2 } = require('../services/b2Storage');

/**
 * @desc    Create a new movie
 * @route   POST /api/movies
 * @access  Private (Admin only)
 */
exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      language,
      releaseDate,
      trailerUrl,
      rating,
      cast,
      director,
      status,
    } = req.body;

    // Validation - check required fields
    if (!title || !description || !duration || !language) {
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, duration, and language',
      });
    }

    // Handle poster image if uploaded
    let posterImage = '/images/placeholder-poster.jpg'; // Default placeholder
    if (req.file) {
      // Upload to Backblaze B2
      posterImage = await uploadToB2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'movies'
      );
    }

    // Parse genre and cast arrays if they come as JSON strings
    let parsedGenre = genre;
    let parsedCast = cast;

    if (typeof genre === 'string') {
      try {
        parsedGenre = JSON.parse(genre);
      } catch (e) {
        // If not JSON, split by comma
        parsedGenre = genre.split(',').map(g => g.trim());
      }
    }

    if (typeof cast === 'string') {
      try {
        parsedCast = JSON.parse(cast);
      } catch (e) {
        // If not JSON, split by comma
        parsedCast = cast.split(',').map(c => c.trim());
      }
    }

    // Create movie object
    const movieData = {
      title,
      description,
      duration: Number(duration),
      genre: parsedGenre,
      language,
      posterImage,
    };

    // Add optional fields if provided
    if (releaseDate) movieData.releaseDate = releaseDate;
    if (trailerUrl) movieData.trailerUrl = trailerUrl;
    if (rating) movieData.rating = Number(rating);
    if (parsedCast) movieData.cast = parsedCast;
    if (director) movieData.director = director;
    if (status) movieData.status = status;

    // Create movie in database
    const movie = await Movie.create(movieData);

    console.log('Movie created successfully:', movie._id, 'Status:', movie.status);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('movieCreated', movie);
      console.log('Socket event emitted: movieCreated');
    } else {
      console.warn('Socket.IO not available');
    }

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    console.error('Create movie error:', error);

    // Handle duplicate title error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A movie with this title already exists',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      message: error.message || 'Server error while creating movie',
    });
  }
};

/**
 * @desc    Get all movies with pagination, search, filters, and sorting
 * @route   GET /api/movies
 * @access  Public
 */
exports.getAllMovies = async (req, res) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query object
    const query = {};

    // Search by title (case-insensitive)
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Filter by language
    if (req.query.language) {
      query.language = req.query.language;
    }

    // Filter by status
    if (req.query.status) {
      // Handle all formats: "Now Showing", "now_showing", "upcoming", etc.
      const statusMap = {
        'Now Showing': ['Now Showing', 'now_showing'],
        'Coming Soon': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'Upcoming': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'Archived': ['Archived', 'archived'],
        'now_showing': ['Now Showing', 'now_showing'],
        'coming_soon': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'upcoming': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'archived': ['Archived', 'archived']
      };
      const statusValues = statusMap[req.query.status] || [req.query.status];
      query.status = { $in: statusValues };
    }

    console.log('Fetching movies with query:', JSON.stringify(query));

    // Sorting
    let sort = {};
    const sortBy = req.query.sortBy || 'releaseDate';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Map sort field names
    switch (sortBy) {
      case 'title':
        sort.title = order;
        break;
      case 'releaseDate':
        sort.releaseDate = order;
        break;
      case 'rating':
        sort.rating = order;
        break;
      default:
        sort.releaseDate = -1; // Default: newest first
    }

    // Execute query with pagination and sorting
    const movies = await Movie.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip);

    console.log(`Found ${movies.length} movies matching query`);

    // Get total count for pagination
    const totalMovies = await Movie.countDocuments(query);
    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      success: true,
      count: movies.length,
      totalMovies,
      currentPage: page,
      totalPages,
      movies,
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({
      message: error.message || 'Server error while fetching movies',
    });
  }
};

/**
 * @desc    Get single movie by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }

    res.status(200).json({
      success: true,
      movie,
    });
  } catch (error) {
    console.error('Get movie by ID error:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid movie ID format',
      });
    }

    res.status(500).json({
      message: error.message || 'Server error while fetching movie',
    });
  }
};

/**
 * @desc    Update a movie
 * @route   PUT /api/movies/:id
 * @access  Private (Admin only)
 */
exports.updateMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      language,
      releaseDate,
      trailerUrl,
      rating,
      cast,
      director,
      status,
    } = req.body;

    // Check if movie exists
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }

    // Handle new poster image upload
    if (req.file) {
      // Delete old poster image from B2 if it exists and is not the placeholder
      if (movie.posterImage && !movie.posterImage.includes('placeholder')) {
        await deleteFromB2(movie.posterImage);
      }
      // Upload new image to B2
      movie.posterImage = await uploadToB2(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        'movies'
      );
    }

    // Parse genre and cast arrays if they come as JSON strings
    let parsedGenre = genre;
    let parsedCast = cast;

    if (genre) {
      if (typeof genre === 'string') {
        try {
          parsedGenre = JSON.parse(genre);
        } catch (e) {
          parsedGenre = genre.split(',').map(g => g.trim());
        }
      }
      movie.genre = parsedGenre;
    }

    if (cast) {
      if (typeof cast === 'string') {
        try {
          parsedCast = JSON.parse(cast);
        } catch (e) {
          parsedCast = cast.split(',').map(c => c.trim());
        }
      }
      movie.cast = parsedCast;
    }

    // Update fields if provided
    if (title) movie.title = title;
    if (description) movie.description = description;
    if (duration) movie.duration = Number(duration);
    if (language) movie.language = language;
    if (releaseDate) movie.releaseDate = releaseDate;
    if (trailerUrl !== undefined) movie.trailerUrl = trailerUrl;
    if (rating !== undefined) movie.rating = rating ? Number(rating) : undefined;
    if (director !== undefined) movie.director = director;
    if (status) movie.status = status;

    // Save updated movie (this will trigger validation)
    const updatedMovie = await movie.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('movieUpdated', updatedMovie);
    }

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie: updatedMovie,
    });
  } catch (error) {
    console.error('Update movie error:', error);

    // Handle duplicate title error
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A movie with this title already exists',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages.join(', '),
      });
    }

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid movie ID format',
      });
    }

    res.status(500).json({
      message: error.message || 'Server error while updating movie',
    });
  }
};

/**
 * @desc    Delete a movie
 * @route   DELETE /api/movies/:id
 * @access  Private (Admin only)
 */
exports.deleteMovie = async (req, res) => {
  try {
    // Check if movie exists
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }

    // Delete associated poster image from B2 if it exists and is not the placeholder
    if (movie.posterImage && !movie.posterImage.includes('placeholder')) {
      await deleteFromB2(movie.posterImage);
    }

    // Delete movie from database
    await Movie.findByIdAndDelete(req.params.id);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('movieDeleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    console.error('Delete movie error:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid movie ID format',
      });
    }

    res.status(500).json({
      message: error.message || 'Server error while deleting movie',
    });
  }
};

/**
 * @desc    Advanced search for movies
 * @route   GET /api/movies/search
 * @access  Public
 */
exports.searchMovies = async (req, res) => {
  try {
    const {
      title,
      genre,
      language,
      minRating,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query object
    const query = {};
    const searchConditions = [];

    // Text search on title and description (uses text index)
    if (title) {
      // Use MongoDB text search for relevance scoring
      query.$text = { $search: title };
    }

    // Filter by genre (supports multiple genres)
    if (genre) {
      const genres = Array.isArray(genre) ? genre : [genre];
      query.genre = { $in: genres };
    }

    // Filter by language
    if (language) {
      query.language = language;
    }

    // Filter by status (handle all formats)
    if (status) {
      const statusMap = {
        'Now Showing': ['Now Showing', 'now_showing'],
        'Coming Soon': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'Upcoming': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'Archived': ['Archived', 'archived'],
        'now_showing': ['Now Showing', 'now_showing'],
        'coming_soon': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'upcoming': ['Coming Soon', 'coming_soon', 'upcoming', 'Upcoming'],
        'archived': ['Archived', 'archived']
      };
      const statusValues = statusMap[status] || [status];
      query.status = { $in: statusValues };
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute search query
    let movies;
    let totalMovies;

    if (query.$text) {
      // Text search with relevance score
      movies = await Movie.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(limitNum)
        .skip(skip);

      totalMovies = await Movie.countDocuments(query);
    } else if (title) {
      // Fallback to regex search if text index is not available
      query.title = { $regex: title, $options: 'i' };
      delete query.$text;

      movies = await Movie.find(query)
        .sort({ releaseDate: -1 })
        .limit(limitNum)
        .skip(skip);

      totalMovies = await Movie.countDocuments(query);
    } else {
      // Regular query without text search
      movies = await Movie.find(query)
        .sort({ releaseDate: -1 })
        .limit(limitNum)
        .skip(skip);

      totalMovies = await Movie.countDocuments(query);
    }

    const totalPages = Math.ceil(totalMovies / limitNum);

    res.status(200).json({
      success: true,
      count: movies.length,
      totalMovies,
      currentPage: pageNum,
      totalPages,
      movies,
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      message: error.message || 'Server error while searching movies',
    });
  }
};
