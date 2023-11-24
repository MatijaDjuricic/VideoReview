import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Form } from 'react-bootstrap';
import Header from '../components/Header';
import axios from 'axios';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import './Register.css';
const Register = () => {
    const URL = import.meta.env.VITE_URL;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    let password_regex = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.{5,}).*)$/;
    let email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const Submit = async(e) => {
        e.preventDefault();
        if (password == confirmPassword && password_regex.test(password) && email_regex.test(email) && name.length > 2) {
            await axios.post(`${URL}/users/register`, {
                name, email, password
            }).then(response => {
                if (response.data == 'exist') {
                    navigate('/register')
                } else if (response.data != 'exist') {
                    axios.post(`${URL}/users/login`, {
                        email, password
                    }).then(response => {
                        if (response.data) {
                            navigate('/', {state: {id: email}});
                        }
                    });
                }
            });
        } else {
            navigate('/register');
        }
    }
    return (
        <>
            <Header/>
            <div className="Register">
                <Row>
                    <Form>
                        <div className="header">
                            <div className="text">Register</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_icon} alt="" />
                                <input type="text" name="name" placeholder="Enter your name" onChange={(e) => setName(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={email_icon} alt="" />
                                <input type="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={password_icon} alt="" />
                                <input type="text" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
                            </div>
                            <div className="input">
                                <img src={password_icon} alt="" />
                                <input type="text" name="confirm_password" placeholder="Confirm your password" onChange={(e) => setConfirmPassword(e.target.value)} required/>
                            </div>
                        </div>
                        <div className="login-wrapper">Alrady have an account? <span><a href="/login">Login</a></span></div>
                        <div className="submit-container">
                            <button className="submit" type="submit" onClick={Submit}>Register</button>
                        </div>
                    </Form>
                </Row>
            </div>
        </>
    );
}
export default Register;