import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ticket = ({ screeningId, userId }) => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:7004/api/seats/screening/${screeningId}`).then((res) => {
      setSeats(res.data);
    });
  }, [screeningId]);

  const bookTicket = async () => {
    const res = await axios.post('http://localhost:7004/api/tickets', {
      user: { id: userId },
      screening: { id: screeningId },
      seatIds: selectedSeats,
    });
    alert(`Ticket booked: ID ${res.data.id}`);
  };

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  return (
    <div>
      {seats.map((seat) => (
        <button key={seat.id} onClick={() => toggleSeat(seat.id)}>
          {seat.seatNumber} - {seat.status}
        </button>
      ))}
      <button onClick={bookTicket}>Book Ticket</button>
    </div>
  );
};

export default Ticket;
