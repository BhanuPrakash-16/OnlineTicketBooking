import React, { useState } from 'react';
import axios from 'axios';

const Theater = ({ hostId }) => {
  const [theater, setTheater] = useState({ name: '', location: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!theater.name || !theater.location ) {
      alert('Please fill all fields');
      return;
    }
    try {
      console.log('hostId:', hostId); // Debug hostId
      await axios.post('http://localhost:7004/api/theaters', {
        name: theater.name,
        location: theater.location,
        host: { id: hostId },
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Theater created');
      setTheater({ name: '', location: '' });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      alert('Failed to create theater: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Theater Name"
        value={theater.name}
        onChange={(e) => setTheater({ ...theater, name: e.target.value })}
      />
      <input
        placeholder="Location"
        value={theater.location}
        onChange={(e) => setTheater({ ...theater, location: e.target.value })}
      />
      <button type="submit">Create Theater</button>
    </form>
  );
};

export default Theater;