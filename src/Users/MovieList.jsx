import { Link } from 'react-router-dom';

const MovieList = ({ movies }) => {
  return (
    <div className="moviesfromapi">
      {movies.map((movie) => (
        <Link key={movie.id} to={`/eventdetails/${movie.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ height: "600px", width: "400px" }}
          />
        </Link>
      ))}
    </div>
  );
};

export default MovieList;
