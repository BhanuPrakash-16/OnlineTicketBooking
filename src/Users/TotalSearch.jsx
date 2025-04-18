import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const OMDB_API_KEY = "fbf785d5"; // Replace with your OMDb API key

const TotalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch movies from OMDb with a 2-second delay before showing results
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
          year: movie.Year,
        }));

      // Introduce a 2-second delay before updating the results
      return new Promise((resolve) => setTimeout(() => resolve(movies), 2000));
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

  return (
    <div>
      {/* Search Box */}
      <div className="search-box" onClick={() => setShowPopup(true)}>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input type="search" placeholder="Search movies..." readOnly />
      </div>

      {/* Popup Search Window */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            {/* Search Input & Close Button */}
            <div className="popup-header">
              <FontAwesomeIcon icon={faSearch} className="popup-search-icon" />
              <input
                type="search"
                placeholder="Search for movies..."
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button className="close-btn" onClick={() => setShowPopup(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Search Results */}
            <div className="popup-body">
              {loading ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  {/* Skeleton Placeholder for Loading */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      <Skeleton height={350} width={250} />
                      <Skeleton width={200} height={20} style={{ margin: "10px auto" }} />
                      <Skeleton width={150} height={15} />
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  {results.map((movie) => (
                    <Link
                      to="/eventdetails/id:"
                      state={{ movie }}
                      key={movie.id}
                      style={{
                        textAlign: "center",
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      <div >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          style={{
                            width: "100%",
                            maxWidth: "250px",
                            height: "350px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            transition: "transform 0.3s ease-in-out",
                          }}
                          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
                          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                        />
                        <p style={{ color: "white" }}>
                          <strong>{movie.title}</strong>
                        </p>
                        <p style={{ color: "white" }}>{movie.year}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="no-results">No results found for "{query}"</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalSearch;
