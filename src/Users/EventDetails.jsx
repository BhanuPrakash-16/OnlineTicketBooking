import { Link, useParams } from 'react-router-dom';
import { faSearch, faChevronDown, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../styles/EventDetails.css';

const OMDB_API_KEY = "fbf785d5";

const EventDetails = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null); // State for fetched movie details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams(); // Get the movie ID from the URL

  // Fetch movie details from OMDb API
  const fetchMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}`
      );
      const data = await response.json();

      if (data.Response === "True") {
        setMovieDetails(data);
      } else {
        setError("Movie not found");
      }
    } catch (err) {
      console.error("OMDb API Error:", err);
      setError("Failed to fetch movie details");
    } finally {
      setLoading(false);
    }
  };

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
    const minutes = parseInt(runtime.split(" ")[0], 10); // Extract number from "155 min"
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id); // Fetch details when ID is available
    }
  }, [id]);

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
  }, [showPopup]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
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
              <a href="/">Home</a>
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
                <Skeleton width={270} height={400} style={{ borderRadius: '20px' }}/>
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
                <img src={movieDetails?.Poster || '/images/Avatar-2.jpg'} alt={`${movieDetails?.Title} Poster`} />
                <div className="eventoverlay"></div>
              </div>
              <div className="moviedetailsdiscription">
                <div className="eventdetailimageposter">
                  <img src={movieDetails?.Poster || 'https://m.media-amazon.com/images/M/MV5BNmQxNjZlZTctMWJiMC00NGMxLWJjNTctNTFiNjA1Njk3ZDQ5XkEyXkFqcGc@._V1_.jpg'} alt={movieDetails?.Title || "Movie"} />
                </div>
                <div className="moviedetailsdiscription-left">
                  <h1>{movieDetails.Title || "Unknown Title"}</h1>
                  <h4>{`${movieDetails?.Year || "N/A"} ‧ ${movieDetails?.Genre || "N/A"} ‧ ${formatRuntime(movieDetails?.Runtime)}`}</h4>
                  <p>
                    {splitText(movieDetails?.Plot).map((line, index) => (
                      <span key={index}>
                        {line}
                        {index < splitText(movieDetails?.Plot).length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <h3>{movieDetails?.Language || "N/A"}</h3>
                  
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
                  {movieDetails?.Actors.split(", ").map((actor, index) => (
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
                  {movieDetails?.Director.split(", ").map((director, index) => (
                    <div key={index} className="crewimagecontainer">
                      
                      <p>{director}<br />(Director)</p>
                    </div>
                  ))}
                  {movieDetails?.Writer.split(", ").map((writer, index) => (
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
                  <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BZGFiMWU4OTAtOGY2MC00ZTIwLThlNmMtOTMwMDAyYjk5M2E3XkEyXkFqcGc@._V1_.jpg" alt="" /></div>
                  <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BOTFjYWUwOGEtZjhkNS00MmZhLWE3NTMtNzhlMTE3MDRjOWYzXkEyXkFqcGc@._V1_.jpg" alt="" /></div>
                  <div className="eventmovieimagecontainer"><img src="https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/marco-et00416394-1734329568.jpg" alt="" /></div>
                  <div className="eventmovieimagecontainer"><img src="https://image.tmdb.org/t/p/original/qtOGsZoLW7QceqKmsOy5nSM6Aik.jpg" alt="" /></div>
                  <div className="eventmovieimagecontainer"><img src="https://m.media-amazon.com/images/M/MV5BZjJmMjJmYWMtNTQyYy00NzcxLWE5N2EtMTY5NjRhMGZmYjNlXkEyXkFqcGc@._V1_.jpg" alt="" /></div>
                </div>
              </div>
            </div>
            <div className="footer">
        <div className="joinwithus"><h2>Got a show, event, activity or a great experience? Partner with us & get listed on Logo  </h2> 
        <Link to='/host/login'><button>Contact Now</button></Link>
      </div>
      
      </div>
          </>
        )}
      </div>
    </>
  );
};

export default EventDetails;