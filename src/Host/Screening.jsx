import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Screening = ({ screenId }) => {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    axios.get('http://localhost:7004/api/movies').then((res) => setMovies(res.data));
  }, []);

  const createScreening = async () => {
    await axios.post('http://localhost:7004/api/screenings', {
      movie: { id: selectedMovieId },
      screen: { id: screenId },
      startTime,
      endTime,
    });
    alert('Screening added');
  };

  return (
    <div>
      <select onChange={(e) => setSelectedMovieId(e.target.value)}>
        <option>Select Movie</option>
        {movies.map((movie) => (
          <option key={movie.id} value={movie.id}>{movie.title}</option>
        ))}
      </select>
      <input type="datetime-local" onChange={(e) => setStartTime(e.target.value)} />
      <input type="datetime-local" onChange={(e) => setEndTime(e.target.value)} />
      <button onClick={createScreening}>Create Screening</button>
    </div>
  );
};

export default Screening;
