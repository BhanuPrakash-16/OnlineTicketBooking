import React, { useState } from 'react';
import axios from 'axios';
import './MovieUpload.css';

const MovieUpload = () => {
  const initialState = {
    title: '', year: '', rated: '', released: '', runtime: '', genre: '',
    director: '', writer: '', actors: '', plot: '', languages: '', imdbRating: '',
    imdbId: '', type: '', posterUrl: '', ratings: '',
  };

  const [movieData, setMovieData] = useState(initialState);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setMovieData({ ...movieData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    // Manual validation: check if any field is empty
    const emptyFields = Object.entries(movieData).filter(([key, value]) => !value.trim());
    if (emptyFields.length > 0) {
      const missingFields = emptyFields.map(([key]) => key).join(', ');
      setError(`❌ Please fill all required fields: ${missingFields}`);
      return;
    }

    try {
      await axios.post('http://localhost:7004/api/movies', movieData);
      alert('✅ Movie added successfully!');
      setMovieData(initialState);
    } catch (error) {
      if (error.response && error.response.data) {
        const apiError = error.response.data;
        if (typeof apiError === 'object') {
          const errorMsg = Object.entries(apiError)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
          setError(`❌ Validation Error(s): ${errorMsg}`);
        } else {
          setError(`❌ Error: ${apiError}`);
        }
      } else {
        setError('❌ Failed to add movie. Check backend or network.');
      }
    }
  };

  return (
    <div className="movie-upload-container">
      <h2>Add Movie</h2>
      {message && <p className="status-message success-message">{message}</p>}
      {error && <p className="status-message error-message">{error}</p>}
      <div className="movie-upload-form">
        {Object.keys(movieData).map((key) => (
          <div key={key} className="form-group">
            <label>{key}</label>
            <input
              type={key === 'released' ? 'date' : 'text'}
              name={key}
              value={movieData[key]}
              onChange={handleChange}
              required
              placeholder={`Enter ${key}`}
            />
          </div>
        ))}
        <button onClick={handleSubmit} className="submit-button">
          Add Movie
        </button>
      </div>
    </div>
  );
};

export default MovieUpload;
