import { useState } from 'react';
import axios from 'axios';

function TheaterUpload() {
  const [theater, setTheater] = useState({
    name: '',
    location: '',
    screens: '',
    seatsPerScreen: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTheater({ ...theater, [name]: value });
    setError(''); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!theater.name || !theater.location || !theater.screens || !theater.seatsPerScreen) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(theater.screens) || isNaN(theater.seatsPerScreen) || theater.screens <= 0 || theater.seatsPerScreen <= 0) {
      setError('Screens and seats per screen must be positive numbers.');
      return;
    }

    try {
      const response = await axios.post('/api/host/theater', theater, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccess('Theater submitted for approval successfully!');
      setTheater({ name: '', location: '', screens: '', seatsPerScreen: '' }); // Reset form
    } catch (error) {
      setError(error.response?.data || 'Failed to submit theater. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', background: '#f9f9f9', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Register Theater</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Theater Name</label>
          <input
            type="text"
            name="name"
            value={theater.name}
            onChange={handleChange}
            placeholder="e.g., Cinepolis: PVP Square Mall"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location</label>
          <input
            type="text"
            name="location"
            value={theater.location}
            onChange={handleChange}
            placeholder="e.g., Vijayawada"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Number of Screens</label>
          <input
            type="number"
            name="screens"
            value={theater.screens}
            onChange={handleChange}
            min="1"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Seats per Screen</label>
          <input
            type="number"
            name="seatsPerScreen"
            value={theater.seatsPerScreen}
            onChange={handleChange}
            min="1"
            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit for Approval
        </button>
      </form>
    </div>
  );
}

export default TheaterUpload;