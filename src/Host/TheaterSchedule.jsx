import { useState, useEffect } from 'react';
import axios from 'axios';

function TheaterSchedule() {
  const [schedule, setSchedule] = useState({
    theaterId: '',
    movieId: '',
    date: '',
    time: '',
    ticketPrice: '',
    isCancellable: false,
    availableSeats: '',
  });
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]); // Fetch from backend if needed

  useEffect(() => {
    // Fetch available movies (approved ones)
    axios.get('/api/movies/approved')
      .then(res => setMovies(res.data));
    // Fetch theaters owned by the host (simplified)
    setTheaters([{ id: 1, name: 'Cinepolis: PVP Square Mall, Vijayawada' }]); // Placeholder
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchedule({
      ...schedule,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/host/theater/schedule', schedule);
      alert('Schedule submitted for approval');
    } catch (error) {
      alert(error.response?.data || 'Error submitting schedule');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
      <select name="theaterId" value={schedule.theaterId} onChange={handleChange} required>
        <option value="">Select Theater</option>
        {theaters.map((theater) => (
          <option key={theater.id} value={theater.id}>{theater.name}</option>
        ))}
      </select>

      <select name="movieId" value={schedule.movieId} onChange={handleChange} required>
        <option value="">Select Movie</option>

      </select>

      <input type="date" name="date" value={schedule.date} onChange={handleChange} required />
      <input type="time" name="time" value={schedule.time} onChange={handleChange} required />
      <input
        type="number"
        name="ticketPrice"
        value={schedule.ticketPrice}
        onChange={handleChange}
        placeholder="Ticket Price (higher than base price)"
        step="0.01"
        required
      />
      <label>
        <input
          type="checkbox"
          name="isCancellable"
          checked={schedule.isCancellable}
          onChange={handleChange}
        />
        Cancellable
      </label>
      <input
        type="number"
        name="availableSeats"
        value={schedule.availableSeats}
        onChange={handleChange}
        placeholder="Available Seats"
        required
      />
      <button type="submit">Submit Schedule</button>
    </form>
  );
}

export default TheaterSchedule;