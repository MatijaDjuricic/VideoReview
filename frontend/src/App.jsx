import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import SingleVideo from './pages/SingleVideo';
import Review from './pages/Review';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import getCookie from './utilities/getCookie';
import './App.css';
const App = () => {
  axios.defaults.withCredentials = true;
  const URL = import.meta.env.VITE_URL;
  const [loginStatus, setLoginStatus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const getUrlEndpoint = location => location.split('/')[2];
  useEffect(() => {
    let session_cookie = getCookie("userIn");
    if (session_cookie) {
      axios.get(`${URL}/users/check`, {
        session_cookie
      }).then(response => {
        if (response.data) {
          setLoginStatus(response.data);
          if (location.pathname == '/login' || location.pathname == '/register') {
            navigate('/');
          }
        }
      });
    } else if (location.pathname == '/login') {
      navigate('/login');
    } else if (location.pathname == '/register') {
      navigate('/register');
    } else {
      navigate('/login');
    }
  },[]);
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path={`/profile/${loginStatus._id}`} element={<Profile id={loginStatus._id}/>}/>
        <Route path={`/video/${getUrlEndpoint(location.pathname)}`} element={<SingleVideo id={getUrlEndpoint(location.pathname)}/>}/>
        <Route path={`/review/${getUrlEndpoint(location.pathname)}`} element={<Review id={getUrlEndpoint(location.pathname)}/>}/>
        {
          location.pathname != `/profile/${loginStatus._id}` ?
          <Route path={location.pathname} element={<NotFound/>}/> : null
        }
      </Routes>
    </div>
  );
}
export default App;