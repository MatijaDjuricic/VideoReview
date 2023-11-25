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
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import './App.css';
if (process.env.REACT_APP_NODE_ENV === 'production') disableReactDevTools();
const App = () => {
  axios.defaults.withCredentials = false;
  const URL = import.meta.env.VITE_URL;
  const [loginStatus, setLoginStatus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const getUrlEndpoint = location => location.split('/')[2];
  useEffect(() => {
    axios.get(`${URL}/users/logged`).then(response => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user);
        if (location.pathname == '/login' || location.pathname == '/register') {
          navigate('/');
        }
      } else if (location.pathname == '/login') {
        navigate('/login');
      } else if (location.pathname == '/register') {
        navigate('/register');
      } else {
        navigate('/login');
      }
    });
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