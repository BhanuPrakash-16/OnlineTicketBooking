import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/TheatreList.css";

const TheatreList = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');

  const timeOptions = ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"];

  return (
    <div className="theatre-list-container">
      <div className="date-time-select">
        

        <div className="input-group">
          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="select-input"
          />
        </div>

        <div className="time-selection">
          <label>Select Time:</label>
          <div className="time-options">
            {timeOptions.map((timeOption, index) => (
              <button
                key={index}
                className={`time-btn ${time === timeOption ? 'selected' : ''}`}
                onClick={() => setTime(timeOption)}
              >
                {timeOption}
              </button>
            ))}
          </div>
        </div>
        
      </div>

      <div className="theatre-buttons">
        {[1, 2, 3, 4].map((theatre, index) => (
          <Link to="/seat" key={index}>
            <button className="theatre-btn">
              Movie Theatre : {theatre}
            </button>
          </Link>
        ))}
      </div>

      <div className="selection-summary">
        {date && <p>Selected Date: {date}</p>}
        {time && <p>Selected Time: {time}</p>}
        {selectedMovie && <p>Selected Movie: {selectedMovie}</p>}
      </div>
    </div>
  );
};

export default TheatreList;