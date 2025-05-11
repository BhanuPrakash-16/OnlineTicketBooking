import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './Users/UserLogin';
import UserSignup from './Users/UserSignup';
import Homepage from './Users/Homepage';
import EventDetails from './Users/EventDetails';
import UploadedEventDetails from './Users/UploadedMovieDetails';
import Error from './Admin/Errornotfound';
import { SkeletonTheme } from 'react-loading-skeleton';
import TicketConfirm from './Users/TicketConfirm';
import SeatSelection from './Users/SeatSelection';
import HostLogin from './Host/HostLogin';
import HostSignup from './Host/HostSignup';
import VerifyOtp from './Users/VerifyOtp';
import HostDashBoard from './Host/HostDashBoard';
import MovieUpload from './Host/MovieUpload';
import TheaterSchedule from './Host/TheaterSchedule';
import TheaterUpload from './Host/TheaterUpload';
import VerifyHostOtp from './Host/VerifyHostOtp';
import Theater from './Host/Theater'
import Sports from './Host/Sports';
import Event from './Host/Event';
import Concert from './Host/Concert';
import BookTicket from "./Users/BookTicket"
import TheatreList from './Users/TheaterList';
import Seats from './Users/Seats';

function App() {
  return (
  <>
<SkeletonTheme baseColor="#202020" highlightColor="#444">
     <BrowserRouter>
           <Routes>
             <Route path="/login" element={<UserLogin />} />
             <Route path="/signup" element={<UserSignup />} />
             <Route path="/verify-otp" element={<VerifyOtp />} />
             <Route path="/" element={<Homepage></Homepage>} />
             <Route path="/seat" element={<Seats/>} />
             <Route path="/book/id:" element={<BookTicket/>} />
             <Route path="/eventdetails/:id" element={<EventDetails/>}/>
             <Route path="/eventdetail/:id" element={<UploadedEventDetails/>}/>
             <Route path="/timings" element={<TheatreList/>} />
             <Route path="/error" element={<Error></Error>}/>
             <Route path="/ticketconfirmation" element={<TicketConfirm/>} />
             <Route path="/host/login" element={<HostLogin />} />
             <Route path="/host/signup" element={<HostSignup />} />
             <Route path="/host/verify-otp" element={<VerifyHostOtp />} />
             <Route path="/host/dashboard" element={<HostDashBoard />} />
             <Route path="/host/uploadmovie" element={<MovieUpload />} />
             <Route path="/host/theater" element={<Theater />} />
             <Route path="/host/sports" element={<Sports />} />
             <Route path="/host/event" element={<Event />} />
             <Route path="/host/concert" element={<Concert />} />
             <Route path="/host/theaterupload" element={<TheaterSchedule />} />

           </Routes>
     </BrowserRouter>
    </SkeletonTheme> 
    {/* <SeatSelection/> */}
    {/* <TicketConfirm/> */}
    {/* <HostDashBoard/> */}
    {/* <MovieUpload /> */}
    {/* <Theater/> */}
    </>
  );
}

export default App;
