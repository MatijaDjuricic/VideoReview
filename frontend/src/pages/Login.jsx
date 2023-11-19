import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Form } from 'react-bootstrap';
import Header from '../components/Header';
import axios from 'axios';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import './Login.css';
const Login = () => {
    const URL = import.meta.env.VITE_URL;
    axios.defaults.withCredentials = true;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const Submit = async(e) => {
        e.preventDefault();
        await axios.post(`${URL}/users/login`, {
            email, password
        }).then(response => {
            if (response.data != 'notexist') {
                navigate('/', {state: {id: email}});
            } else if (response.data == 'notexist') {
                navigate('/login')
            }
        });
    }
    return (
        <>
            <Header/>
            <div className="Login">
                <Row>
                    <Form>
                        <div className="header">
                            <div className="text">Login</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={email_icon} alt="" />
                                <input type="text" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={password_icon} alt="" />
                                <input type="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                        </div>
                        <div className="register-wrapper">Don't have an account? <span><a href="/register">Register</a></span></div>
                        <div className="submit-container">
                            <button className="submit" type="submit" onClick={Submit}>Login</button>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    );
}
export default Login;