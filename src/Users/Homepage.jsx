import { useEffect, useState, useRef } from "react";
import "../styles/Homepage.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faVolumeMute,
  faVolumeUp,
  faSearch,
  faTimes,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AvatarClip from "../assets/Avatar-2teluguclip.mp4";
import CaptainAmericaClip from "../assets/CaptainAmericaNewWorld.mp4";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const Homepage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const swiperRef = useRef(null);
  const videoRefs = useRef([]);
  const moviesScrollRef = useRef(null);
  const concertsScrollRef = useRef(null);
  const sportsScrollRef = useRef(null);
  const eventsScrollRef = useRef(null);
  const navigate = useNavigate();
  const OMDB_API_KEY = "fbf785d5";

  // Check authentication status
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUsername(userData.fullName || "User");
    }
  }, []);

  // Fetch movies from backend
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:7004/api/movies");
        setMovies(response.data);
      } catch (err) {
        setError("Failed to fetch movies. Please try again later.");
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const scrollNext = (scrollRef) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector(".movieimagecontainer")?.offsetWidth || 200;
      scrollRef.current.scrollBy({
        left: cardWidth + 20,
        behavior: "smooth",
      });
    }
  };

  const fetchFromOMDb = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`
      );
      const data = await response.json();
      if (data.Response === "False") return [];
      const movies = data.Search
        .filter((movie) => movie.Poster !== "N/A" && movie.Poster !== "")
        .map((movie) => ({
          id: movie.imdbID,
          title: movie.Title,
          poster: movie.Poster,
          year: parseInt(movie.Year, 10),
        }))
        .sort((a, b) => b.year - a.year);
      return new Promise((resolve) => setTimeout(() => resolve(movies), 0));
    } catch (error) {
      console.error("OMDb API Error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      const omdbResults = await fetchFromOMDb(query);
      setResults(omdbResults);
    };
    const debounceTimeout = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounceTimeout);
  }, [query]);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setIsHovered(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
    if (videoRefs.current[index]) {
      videoRefs.current[index].play().catch((err) =>
        console.error("Video play failed:", err)
      );
    }
  };

  const handleMouseLeave = (index) => {
    setHoveredIndex(null);
    setIsHovered(false);
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
    }
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      videoRefs.current.forEach((video) => {
        if (video) video.muted = newMutedState;
      });
      return newMutedState;
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:7004/api/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    }
    setIsAuthenticated(false);
    setUsername("");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Carousel movies
  const carouselMovies = [
    { name: "Avatar", img: "/images/Avatar-2.jpg", video: AvatarClip, movieid: "tt1630029" },
    {
      name: "Captain America",
      img: "https://pbs.twimg.com/media/GcBNWznaAAA1QaX?format=jpg&name=4096x4096",
      video: CaptainAmericaClip,
      movieid: "tt14513804",
    },
  ];

  return (
    <div className="homepagecontainer">
      <nav className={`homepageheader ${isScrolled ? "blur-header" : ""}`}>
        <div className="homepageheader-left">
          <div className="logo">LOGO</div>
          <div className="homepagesearchbox" onClick={() => setShowPopup(true)}>
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="What's on your mind?"
              readOnly
              className="search-input-header"
            />
          </div>
          <div className="homepageheaderlist">
            <a href="#">Home</a>
            <div
              className="homepage-bookdropdown"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <a href="#">
                Book <FontAwesomeIcon icon={faChevronDown} className="homepagedropdown-icon" />
              </a>
              {isOpen && (
                <div className="dropdown-content">
                  <p><a href="#movies">Movies</a></p>
                  <p><a href="#concerts">Concerts</a></p>
                  <p><a href="#sports">Sports</a></p>
                  <p><a href="#events">Events</a></p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="homepageheader-right">
          <div
            className="homepagedropdown"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <a href="#">
              Cities <FontAwesomeIcon icon={faChevronDown} className="homepagedropdown-icon" />
            </a>
            {isOpen && (
              <div className="dropdown-content">
                <p>Vijayawada</p>
                <p>Guntur</p>
                <p>Hyderabad</p>
              </div>
            )}
          </div>
          {!isAuthenticated ? (
            <>
              <div className="homepageSignup">
                <Link to="/signup">
                  <button>Signup</button>
                </Link>
              </div>
              <div className="homepageLogin">
                <Link to="/login">
                  <button>Login</button>
                </Link>
              </div>
            </>
          ) : (
            <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <FontAwesomeIcon icon={faUserCircle} size="2x" />
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p>Welcome,<br /> {username}</p>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <FontAwesomeIcon icon={faSearch} className="popup-search-icon" />
              <input
                type="search"
                placeholder="Search for movies..."
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="popup-search-input"
              />
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="popup-body">
              {loading ? (
                <div className="skeleton-grid">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="skeleton-item">
                      <Skeleton height={350} width={250} />
                      <Skeleton width={200} height={20} style={{ margin: "10px auto" }} />
                      <Skeleton width={150} height={15} />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div className="results-grid">
                  {results.map((movie) => (
                    <Link
                      to={`/eventdetails/${movie.id}`}
                      state={{ movie }}
                      key={movie.id}
                      className="result-item"
                    >
                      <img src={movie.poster} alt={movie.title} className="result-poster" />
                      <p className="result-title"><strong>{movie.title}</strong></p>
                      <p className="result-year">{movie.year}</p>
                    </Link>
                  ))}
                </div>
              ) : query.trim() === "" ? (
                <div className="empty-state"></div>
              ) : (
                <p className="no-results">No results found for "{query}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="carousel-container">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Autoplay]}
          className="carousel-slider"
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {carouselMovies.map((movie, index) => (
            <SwiperSlide key={index} className="carousel-slide">
              <div
                className="imageposter"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <img
                  src={movie.img}
                  alt={`${movie.name} poster`}
                  className={hoveredIndex === index && movie.video ? "hidden" : "visible"}
                />
                {movie.video && (
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={movie.video}
                    muted={isMuted}
                    loop
                    playsInline
                    className={hoveredIndex === index ? "visible" : "hidden"}
                  />
                )}
                <div className="overlay"></div>
                <div className="contentonimage">
                  <div className="contentonimage-left">
                    {movie.name === "Avatar" && (
                      <div className="movie-logo">
                        <img
                          src="/images/avatar-2text.png"
                          alt="Avatar movie logo"
                          className="avatar-logo"
                        />
                      </div>
                    )}
                    {movie.name === "Captain America" && (
                      <div className="movie-logo">
                        <img
                          src="/images/captainamericanew.png"
                          alt="Captain America movie logo"
                          className="movie-logo"
                        />
                      </div>
                    )}
                    <div className="contentimage-buttons">
                      <Link to={`/eventdetails/${movie.movieid}`}>
                        <button className="book-now-btn">Book Now</button>
                      </Link>
                      <Link to={`/eventdetails/${movie.movieid}`} state={{ movie }}>
                        <button className="view-details-btn">View Details</button>
                      </Link>
                    </div>
                  </div>
                  <div className="contentonimage-right">
                    {movie.video && (
                      <div className="mute-unmute-button" onClick={toggleMute}>
                        <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeUp} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="moviecontainer" id="movies">
        <div className="movietitlecontainer">
          <h1>NOW PLAYING</h1>
          <button onClick={() => scrollNext(moviesScrollRef)}>
            See more <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="movie-scroll-container">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {loading ? (
            <div className="movie-scroll" ref={moviesScrollRef}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="movieimagecontainer">
                  <Skeleton height={400} width={250} />
                </div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="movie-scroll" ref={moviesScrollRef}>
              {movies.map((movie) => (
                <Link
                  to={`/eventdetail/${movie.imdbId}`}
                  state={{ movie }}
                  key={movie.imdbId}
                >
                  <div className="movieimagecontainer">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <h2>{movie.title}</h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No movies available.</p>
          )}
        </div>
      </div>

      <div className="moviecontainer" id="concerts">
        <div className="movietitlecontainer">
          <h1>MUSIC CONCERTS</h1>
          <button onClick={() => scrollNext(concertsScrollRef)}>
            See more <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="movie-scroll-container">
          <div className="movie-scroll" ref={concertsScrollRef}>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00419764-butfsvkdsz-portrait.jpg"
                alt="concert"
              />
            </div>
            <div className="movieimagecontainer">
              <img src="https://in.bmscdn.com/events/moviecard/ET00430112.jpg" alt="concert" />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://www.premiertickets.co/assets/uploads/2025/01/vinesh-1.jpg"
                alt="concert"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00427647-jpsxrflhjw-portrait.jpg"
                alt="concert"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00406807-sprzrvbcsj-portrait.jpg"
                alt="concert"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00406807-sprzrvbcsj-portrait.jpg"
                alt="concert"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="moviecontainer" id="sports">
        <div className="movietitlecontainer">
          <h1>SPORTS</h1>
          <button onClick={() => scrollNext(sportsScrollRef)}>
            See more <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="movie-scroll-container">
          <div className="movie-scroll" ref={sportsScrollRef}>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/nmcms/events/banner/weblisting/tata-wpl-2025-vadodara-et00431268-2025-1-29-t-8-54-53.jpg"
                alt="sports"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00431534-pmkaskcjlu-portrait.jpg"
                alt="sports"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/et00417593-czjcrnelda-portrait.jpg"
                alt="sports"
              />
            </div>
            <div className="movieimagecontainer">
              <img src="https://in.bmscdn.com/events/moviecard/ET00428227.jpg" alt="sports" />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00431076-tfclwffpvh-portrait.jpg"
                alt="sports"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00431076-tfclwffpvh-portrait.jpg"
                alt="sports"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="moviecontainer" id="events">
        <div className="movietitlecontainer">
          <h1>EXPLORE FUN ACTIVITIES</h1>
          <button onClick={() => scrollNext(eventsScrollRef)}>
            See more <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div className="movie-scroll-container">
          <div className="movie-scroll" ref={eventsScrollRef}>
            <div className="movieimagecontainer">
              <img
                src="https://media.istockphoto.com/id/1309885670/vector/summer-camp-poster-child-journey-camping-comic-style-flyer-school-kids-vacation-ad-brochure.jpg?s=612x612&w=0&k=20&c=h3ZiqmDlXTjvem0y90sUr30QJl14gTeM23GquxlS2aI="
                alt="event"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00428714-nwgnzbxnqb-portrait.jpg"
                alt="event"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/et00431646-ykguhmthgs-portrait.jpg"
                alt="event"
              />
            </div>
            <div className="movieimagecontainer">
              <img
                src="https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00370963-uvhpugehca-portrait.jpg"
                alt="event"
              />
            </div>
            <div className="movieimagecontainer">
              <img src="https://in.bmscdn.com/events/moviecard/ET00414194.jpg" alt="event" />
            </div>
            <div className="movieimagecontainer">
              <img src="https://in.bmscdn.com/events/moviecard/ET00414194.jpg" alt="event" />
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <div className="joinwithus">
          <h2>
            Got a show, event, activity or a great experience? Partner with us &
            get listed on Logo
          </h2>
          <Link to="/host/login">
            <button>Contact Now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;