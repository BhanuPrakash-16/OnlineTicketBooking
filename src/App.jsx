import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserLogin from './Users/UserLogin';
import UserSignup from './Users/UserSignup';
import Homepage from './Users/Homepage';
import EventDetails from './Users/EventDetails';
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
             <Route path="/eventdetails/:id" element={<EventDetails></EventDetails>}/>
             <Route path="/error" element={<Error></Error>}/>
             <Route path="/host/login" element={<HostLogin />} />
             <Route path="/host/signup" element={<HostSignup />} />
             <Route path="/host/dashboard" element={<HostDashBoard />} />
             <Route path="/host/uploadmovie" element={<MovieUpload />} />
             <Route path="/host/uploadtheater" element={<TheaterUpload />} />
             <Route path="/host/theaterupload" element={<TheaterSchedule />} />
           </Routes>
     </BrowserRouter>
    </SkeletonTheme>
    {/* <SeatSelection/> */}
    {/* <TicketConfirm/> */}
    </>
  );
}

export default App;
