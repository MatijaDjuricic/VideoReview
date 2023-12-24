import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Form, Button } from 'react-bootstrap';
import Header from '../components/Header';
import axios from 'axios';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import './Profile.css';
const Profile = props => {
  axios.defaults.withCredentials = true;
  const URL = import.meta.env.VITE_URL;
  const [user, setUser] = useState([]);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [eye1, setEye1] = useState(false);
  const [eye2, setEye2] = useState(false);
  const navigate = useNavigate();
  const toggleEye = e => {
    e.preventDefault();
    if (e.target.id == 'eye1') setEye1(eye => !eye);
    if (e.target.id == 'eye2') setEye2(eye => !eye);
  }
  const Submit = async(e) => {
    e.preventDefault();
    let Name = name.trim();
    let Email = email.trim();
    let Password = password.trim();
    let ConfirmPassword = confirmPassword.trim();
    if (Name == '' || Name === undefined) setName(user.name);
    if (Email == '' || Email === undefined) setEmail(user.email);
    if ((Password == ConfirmPassword) && Password !== undefined && Password != '') {
        axios.patch(`${URL}/users/user/edit/${props.id}`, {
            Name, Email, Password
        }).then(response => {
            if (response.data != 'notexist') {
                navigate('/');
            } else navigate(`/profile/${props.id}`);
        });
    } else navigate(`/profile/${props.id}`);
  }
  useEffect(() => {
    axios.get(`${URL}/users/user/${props.id}`).then(response => setUser(response.data));
  },[]);
  return (
        <>
            <Header name={user.name} id={user._id}/>
            <div className="Profile">
                <Row>
                    <Form>
                        <div className="header">
                            <a href="/"><Button className="back-btn" size="sm" variant="danger"><i className="fa-solid fa-angles-left"></i></Button></a>
                            <div className="text">Edit Profile</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_icon} alt="" />
                                <input type="text" name="name" defaultValue={user.name} onChange={(e) => setName(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={email_icon} alt="" />
                                <input type="email" name="email" defaultValue={user.email} onChange={(e) => setEmail(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={password_icon} alt="" />
                                <input type={!eye1 ? 'password' : 'text'} name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
                                <button className='eye' id='eye1' onClick={(e) => toggleEye(e)}>{!eye1 ? <i className="fa-solid fa-eye" id='eye1'></i> : <i className="fa-solid fa-eye-slash" id='eye1'></i>}</button>
                            </div>
                            <div className="input">
                                <img src={password_icon} alt="" />
                                <input type={!eye2 ? 'password' : 'text'} name="confirm_password" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} required/>
                                <button className='eye' id='eye2' onClick={(e) => toggleEye(e)}>{!eye2 ? <i className="fa-solid fa-eye" id='eye2'></i> : <i className="fa-solid fa-eye-slash" id='eye2'></i>}</button>
                            </div>
                        </div>
                        <div className="forgot-wrapper"><span><a href="/">Forgot Password?</a></span></div>
                        <div className="submit-container">
                            <button className="submit" type="submit" onClick={Submit}>Edit</button>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    );
}
export default Profile;