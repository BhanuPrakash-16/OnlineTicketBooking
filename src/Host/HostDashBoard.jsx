import React from 'react';
import "./HostDashboard.css";
import { Link } from 'react-router-dom';

const HostDashBoard = () => {
  return (
    <div className='hostdashboardcontainer'>
      <header className='hostdashboardheader'>
        Host Dashboard
      </header>
      <div className='selectcontainerforhost'>
        <div className="selectcateogycontainerforhost">

          <div className="uploadmoviecontainerforhost">
            <div className="image-wrapper">
              <Link to="/host/uploadmovie">
                <img src="https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg" alt="Movie" />
                <div className="overlay-text">Movie</div>
              </Link>
            </div>
          </div>

          <div className="uploadsporteventforhost">
            <div className="image-wrapper">
              <Link to="/host/sports">
              <img src="https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg?semt=ais_hybrid&w=740" alt="Sports" />
              <div className="overlay-text">Sports</div></Link>
            </div>
          </div>

          <div className="uploadmusiceventforhost">
            <div className="image-wrapper">
              <Link to="/host/concert">
              <img src="https://media.istockphoto.com/id/1362676190/vector/concert-hall-with-people-silhouettes.jpg?s=612x612&w=0&k=20&c=yWiaVPaJfJKNqo3oUPQF55QXzt1CULeOYiN_fnfsPXo=" alt="Concert" />
              <div className="overlay-text">Concert</div></Link>
            </div>
          </div>

          <div className="uploadeventforhost">
            <div className="image-wrapper">
              <Link to="/host/event">
              <img src="https://www.shutterstock.com/image-vector/happy-carnival-colorful-geometric-background-600nw-2399092997.jpg" alt="Events" />
              <div className="overlay-text">Events</div>
              </Link>
            </div>
          </div>

          {/* New Theater Management Block */}
          <div className="theatermanagementforhost" style={{display:"flex", alignItems:"center", justifyContent:"center",height:"300px",widows:"300px"}}>
            <div className="image-wrapper" >
              <Link to="/host/theater">
                <img src="https://media.istockphoto.com/id/1295114854/photo/empty-red-armchairs-of-a-theater-ready-for-a-show.jpg?s=612x612&w=0&k=20&c=0rDtwzMmLbqe_8GuGw2dpjkD0MsXGywJmdmg0jDbMxQ=" alt="Theater Management" />
                <div className="overlay-text">Theater<br/> Management</div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HostDashBoard;
