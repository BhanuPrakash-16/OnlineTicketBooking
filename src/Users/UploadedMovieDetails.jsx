import { Link, useParams, useLocation } from 'react-router-dom';
import { faSearch, faChevronDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/EventDetails.css';
import axios from 'axios';

const UploadedMovieDetails = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const location = useLocation();

  // Fetch movie details from backend
  const fetchMovieDetails = async (imdbId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7004/api/movies/${imdbId}`);
      setMovieDetails(response.data);
    } catch (err) {
      console.error("Backend API Error:", err);
      setError("Failed to fetch movie details");
    } finally {
      setLoading(false);
    }
  };

  // Check for movie data in location.state or fetch from backend
  useEffect(() => {
    if (location.state?.movie) {
      setMovieDetails(location.state.movie);
      setLoading(false);
    } else if (id) {
      fetchMovieDetails(id);
    } else {
      setError("No movie ID provided");
      setLoading(false);
    }
  }, [id, location.state]);

  // Utility function to split text every 12 words
  const splitText = (text, maxWords = 12) => {
    if (!text) return ["No description available."];
    const words = text.split(" ");
    const result = [];
    for (let i = 0; i < words.length; i += maxWords) {
      result.push(words.slice(i, i + maxWords).join(" "));
    }
    return result;
  };

  // Utility function to convert minutes to "xh ym" format
  const formatRuntime = (runtime) => {
    if (!runtime || runtime === "N/A") return "N/A";
    const minutes = parseInt(runtime.split(" ")[0], 10);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Handle popup body class
  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [showPopup]);

  // Handle scroll for header blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return <div className="eventdetailcontainer text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="eventdetailcontainer">
      <nav className={`eventpageheader ${isScrolled ? 'blur-header' : ''}`}>
        <div className="eventpageheader-left">
          <div className="logo">LOGO</div>
          <div className="eventpagesearchbox" onClick={() => setShowPopup(true)}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="search" placeholder="Search" readOnly />
          </div>
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <div className="popup-header">
                  <FontAwesomeIcon icon={faSearch} className="popup-search-icon" />
                  <input type="search" placeholder="Search for movies, events..." autoFocus />
                  <button className="close-btn" onClick={() => setShowPopup(false)}>
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                </div>
                <div className="popup-body">
                  <h3>Popular Searches</h3>
                  <div className="suggestions">
                    <button>Avatar 2</button>
                    <button>Fighter</button>
                    <button>Salaar</button>
                    <button>Concerts</button>
                  </div>
                  <h3>Categories</h3>
                  <div className="categories">
                    <button>Movies</button>
                    <button>Sports</button>
                    <button>Events</button>
                    <button>Plays</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="eventpageheaderlist">
            <Link to="/">Home</Link>
          </div>
        </div>
        <div className="eventpageheader-right">
          <div className="homepagedropdown" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <a href="#">Cities <FontAwesomeIcon icon={faChevronDown} className="homepagedropdown-icon" /></a>
            {isOpen && (
              <div className="dropdown-content">
                <p>Vijayawada</p>
                <p>Guntur</p>
                <p>Hyderabad</p>
              </div>
            )}
          </div>
          <div className="eventpageLogin">
            <Link to="/login"><button>Login</button></Link>
          </div>
        </div>
      </nav>

      {loading ? (
        <div className="eventimageposter-container">
          <div className="eventimageposter">
            <Skeleton height={650} width="100%" />
          </div>
          <div className="moviedetailsdiscription">
            <div className="eventdetailimageposter">
              <Skeleton width={270} height={400} style={{ borderRadius: '20px' }} />
            </div>
            <div className="moviedetailsdiscription-left">
              <Skeleton width={300} height={40} />
              <Skeleton width={250} height={20} style={{ marginTop: '20px' }} />
              <Skeleton count={3} width="100%" />
              <Skeleton width={200} height={20} style={{ marginTop: '10px' }} />
              <Skeleton width={120} height={40} style={{ marginTop: '20px' }} />
            </div>
          </div>
          <div className="castofthemoviecontainer">
            <div className="casttitle">
              <Skeleton width={100} height={30} />
            </div>
            <div className="cast-scroll-container">
              <div className="cast-scroll">
                {Array(5).fill().map((_, index) => (
                  <div key={index} className="castimagecontainer">
                    <Skeleton width={80} height={20} style={{ marginTop: '10px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="crewofthemoviecontainer">
            <div className="crewtitle">
              <Skeleton width={100} height={30} />
            </div>
            <div className="crew-scroll-container">
              <div className="crew-scroll">
                {Array(3).fill().map((_, index) => (
                  <div key={index} className="crewimagecontainer">
                    <Skeleton width={80} height={20} style={{ marginTop: '10px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="eventimageposter-container">
            <div className="eventimageposter">
              <img src={movieDetails?.posterUrl || '/images/Avatar-2.jpg'} alt={`${movieDetails?.title} Poster`} />
              <div className="eventoverlay"></div>
            </div>
            <div className="moviedetailsdiscription">
              <div className="eventdetailimageposter">
                <img src={movieDetails?.posterUrl || 'https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_.jpg'} alt={movieDetails?.title || "Movie"} />
              </div>
              <div className="moviedetailsdiscription-left">
                <h1>{movieDetails?.title || "Unknown Title"}</h1>
                <h4>{`${movieDetails?.year || "N/A"} ‧ ${movieDetails?.genre || "N/A"} ‧ ${(movieDetails?.runtime || "2h 49m")}`}</h4>
                <p>
                  {splitText(movieDetails?.plot).map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < splitText(movieDetails?.plot).length - 1 && <br />}
                    </span>
                  ))}
                </p>
                <h3>{movieDetails?.languages || "N/A"}</h3>
                <Link to="/timings">
                  <button className="book-now-btn">Book Now</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="castofthemoviecontainer">
            <div className="casttitle">
              <h2>Cast</h2>
              <button>See more <i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <div className="cast-scroll-container">
              <div className="cast-scroll">
                {movieDetails?.actors.split(", ").map((actor, index) => (
                  <div key={index} className="castimagecontainer">
                    <p>{actor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="crewofthemoviecontainer">
            <div className="crewtitle">
              <h2>Crew</h2>
              <button>See more <i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <div className="crew-scroll-container">
              <div className="crew-scroll">
                {movieDetails?.director.split(", ").map((director, index) => (
                  <div key={index} className="crewimagecontainer">
                    <p>{director}<br />(Director)</p>
                  </div>
                ))}
                {movieDetails?.writer.split(", ").map((writer, index) => (
                  <div key={index} className="crewimagecontainer">
                    <p>{writer}<br />(Writer)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="eventmoviecontainer">
            <div className="eventmovietitlecontainer">
              <h2>Recommended Movies</h2>
              <button>See more <i className="fa-solid fa-arrow-right"></i></button>
            </div>
            <div className="eventmovie-scroll-container">
              <div className="eventmovie-scroll">
                <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BZGFiMWU4OTAtOGY2MC00ZTIwLThlNmMtOTMwMDAyYjk5M2E3XkEyXkFqcGc@._V1_.jpg" alt="Movie" /></div>
                <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BOTFjYWUwOGEtZjhkNS00MmZhLWE3NTMtNzhlMTE3MDRjOWYzXkEyXkFqcGc@._V1_.jpg" alt="Movie" /></div>
                <div className="eventmovieimagecontainer"><img src="https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/marco-et00416394-1734329568.jpg" alt="Movie" /></div>
                <div className="eventmovieimagecontainer"><img src="https://image.tmdb.org/t/p/original/qtOGsZoLW7QceqKmsOy5nSM6Aik.jpg" alt="Movie" /></div>
                <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BZjJmMjJmYWMtNTQyYy00NzcxLWE5N2EtMTY5NjRhMGZmYjNlXkEyXkFqcGc@._V1_.jpg" alt="Movie" /></div>
              </div>
            </div>
          </div>

          <div className="footer">
            <div className="joinwithus">
              <h2>Got a show, event, activity or a great experience? Partner with us & get listed on Logo</h2>
              <Link to="/host/login"><button>Contact Now</button></Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadedMovieDetails;