import React, { useState } from "react";
import "../styles/SeatSelection.css";
import { Link } from "react-router-dom";

const Seats = () => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const seatMatrix = Array(14).fill(0); // 14 seats per row
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="seat-container">
      <h2>Select Your Seats</h2>

      <div className="seat-grid">
        {rows.map((row) => (
          <div className="row" key={row}>
            <span className="row-label">{row}</span>
            {seatMatrix.map((_, index) => {
              const seatNumber = `${row}${index + 1}`;
              const isSelected = selectedSeats.includes(seatNumber);
              return (
                <div
                  key={seatNumber}
                  className={`seat ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSeatSelection(seatNumber)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="selection-summary">
        {selectedSeats.length > 0 && (
          <p>Selected Seats: {selectedSeats.join(", ")}</p>
        )}
      </div>

      <Link to="/ticketconfirmation">
        <button className="pay-button">PAY</button>
      </Link>
    </div>
  );
};

export default Seats;
