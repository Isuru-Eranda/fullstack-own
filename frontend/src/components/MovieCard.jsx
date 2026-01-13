import PropTypes from 'prop-types';
import { useNavigate } from '../hooks/useNavigate';

/**
 * MovieCard Component - Displays a movie card with poster, title, rating, and actions
 * @param {Object} movie - Movie object containing id, title, posterImage, genre, duration, rating, status
 * @param {Function} onClick - Callback function when card is clicked
 */
export default function MovieCard({ movie, onClick }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };

  return (
    <div 
      className="bg-surface-600 border border-secondary-400 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-secondary-500/50 hover:scale-105 transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Poster Area */}
      <div className="relative aspect-[2/3] bg-surface-500">
        {movie.posterImage ? (
          <img 
            src={movie.posterImage} 
            alt={movie.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-400">
            <div className="text-text-muted text-6xl font-bold">🎬</div>
          </div>
        )}
        
        {/* Rating Badge - Top Right */}
        <div className="absolute top-2 right-2 bg-surface-600 border border-secondary-300 px-2 py-1 text-xs font-bold shadow-sm text-secondary-300">
          {movie.rating || 'NR'}
        </div>
        
        {/* Status Badge (if movie has special status) */}
        {movie.status && movie.status !== 'active' && (
          <div className={`absolute bottom-2 left-2 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded shadow-lg ${
            movie.status === 'now_showing' || movie.status === 'Now Showing'
              ? 'bg-green-500/90 text-white border border-green-400'
              : movie.status === 'upcoming' || movie.status === 'Coming Soon'
              ? 'bg-yellow-500/90 text-black border border-yellow-400'
              : movie.status === 'archived' || movie.status === 'Archived'
              ? 'bg-red-500/90 text-white border border-red-400'
              : 'bg-surface-600 text-text-primary border border-secondary-400'
          }`}>
            {movie.status === 'now_showing' ? 'Now Showing' :
             movie.status === 'upcoming' ? 'Coming Soon' :
             movie.status === 'archived' ? 'Archived' :
             movie.status}
          </div>
        )}
      </div>
      
      {/* Movie Info Section */}
      <div className="p-4 border-t border-secondary-400">
        {/* Movie Title */}
        <h3 className="font-bold text-sm text-text-primary mb-2 truncate uppercase tracking-wide" title={movie.title}>
          {movie.title}
        </h3>
        
        {/* Genre and Duration (optional info) */}
        {(movie.genre || movie.duration) && (
          <div className="text-xs text-text-muted mb-3 flex items-center gap-2">
            {movie.genre && (
              <span className="truncate">
                {Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}
              </span>
            )}
            {movie.genre && movie.duration && <span>•</span>}
            {movie.duration && <span>{movie.duration} min</span>}
          </div>
        )}
        
        {/* Book Button */}
        <button 
          className="w-full py-2 bg-primary-500 border border-secondary-400 text-text-primary font-bold text-sm hover:bg-primary-600 transition uppercase tracking-wider rounded shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/movies/${movie._id || movie.id}/showtimes`);
          }}
        >
          BOOK
        </button>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    posterImage: PropTypes.string,
    genre: PropTypes.string,
    duration: PropTypes.number,
    rating: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};
