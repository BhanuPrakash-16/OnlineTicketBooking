import React, { useState } from 'react';
import axios from 'axios';

const Seat = ({ screeningId }) => {
  const [seatNumber, setSeatNumber] = useState('');
  const [price, setPrice] = useState('');

  const addSeat = async () => {
    await axios.post('http://localhost:7004/api/seats', {
      seatNumber,
      price,
      screening: { id: screeningId },
    });
    alert('Seat added');
  };

  return (
    <div>
      <input placeholder="Seat Number" onChange={(e) => setSeatNumber(e.target.value)} />
      <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <button onClick={addSeat}>Add Seat</button>
    </div>
  );
};

export default Seat;
