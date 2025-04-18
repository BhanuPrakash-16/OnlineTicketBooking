import React from "react";
import "../styles/TicketConfirm.css";
import moviePoster from "/images/Avatar-2.jpg"; 

const TicketConfirm = () => {
  return (
    <div className="ticket-container">
      <div className="ticket-content">
      
        <img src={moviePoster} alt="Movie Poster" className="posterofthemovie" />

        
        <div className="ticket-details">
          <h2>Avatar: The Way of Water</h2>
          <p className="moviegenere-timing">2022 • Sci-fi/Action • 3h 12m</p>
          <div className="rating">
            ⭐⭐⭐⭐☆ <span>4.5</span>
          </div><br/>

          
          <div className="onerowofdetails">
            <p>
              <span className="label">Theater:</span><br/> INOX: Laila Mall, M.G. Road
            </p></div><br/>
            <div className="tworowofdetails">
            <p>
              <span className="label">Date:</span><br/> Wednesday, 5 Feb
            </p>
            <p>
              <span className="label">Begins:</span><br/> 07:30 PM
            </p>
            <p>
              <span className="label">Ends:</span><br/>11:00 PM
            </p>
            </div><br/>
            <div className="threerowofdetails">
            <p>
              <span className="label">Row:</span><br/> G, H
            </p>
            <p>
              <span className="label">Seats:</span><br/> G7, G8, H6, H7
            </p>
            </div><br/>
            

        
          <div className="booking-details">
            <p>
              <span className="booking-id">BOOKING ID:</span> ABCDEF123456
            </p>
            <p>
              <span className="booking-total">TOTAL:</span> ₹ 1200.00
            </p>
          </div>

          
          <div className="barcode"></div>

          
          
        </div>
      </div>
    </div>
  );
};

export default TicketConfirm;
