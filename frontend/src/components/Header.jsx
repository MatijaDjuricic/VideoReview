import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import removeCookie from '../utilities/removeCookie';
import SideBar from './SideBar';
import './Header.css';
import getCookie from '../utilities/getCookie';
const Header = props => {
    axios.defaults.withCredentials = true;
    const [isOpen, setIsOpen] = useState(false);
    const openSideBar = () => setIsOpen(true);
    const closeSideBar = () => setIsOpen(false);
    const navigate = useNavigate();
    const logOut = async e => {
        e.preventDefault();
        if (getCookie("userIn")) {
            removeCookie("userIn")
            navigate('/login');
        };
    }
    return (
        <div className="header-nav" >
            <i className="fa-brands fa-youtube" ></i>
            <i className="fa-brands fa-youtube" ></i>
            <i className="fa-brands fa-youtube" ></i>
            <a href="/" className='h1-link'><h1>Video Review</h1></a>
            {
                props.name ?
                <>
                    <p className='username-text'>Hi, <a href={`/profile/${props.id}`}>{props.name}</a></p>
                    <Button className='logout-btn' type="submit" size='sm' onClick={logOut}>Log Out <i className="fa-solid fa-right-from-bracket"></i></Button>
                    <Button className='hamburger-btn' onClick={openSideBar}><i className="fa-solid fa-bars-staggered"></i></Button>
                    <SideBar isOpen={isOpen} closeSideBar={closeSideBar} user_id={props.id}/>
                </>
                :
                <>
                    <i className="fa-brands fa-youtube" ></i>
                    <i className="fa-brands fa-youtube" ></i>
                    <i className="fa-brands fa-youtube" ></i>
                </>
            }
        </div>
    );
}
export default Header;