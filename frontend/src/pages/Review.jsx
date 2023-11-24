import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import NotFound from "./NotFound";
import './Review.css';
const Review = props => {
    axios.defaults.withCredentials = false;
    const API_KEY = import.meta.env.VITE_API_KEY;
    const URL = import.meta.env.VITE_URL;
    const [data, setData] = useState([]);
    const [loginStatus, setLoginStatus] = useState([]);
    const [content, setContent] = useState('');
    const [rating, setRating] = useState();
    const navigate = useNavigate();
    const getSingleVideo = async() => {
    const API = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${props.id}&key=${API_KEY}`;
        await fetch(API).then(res => res.json()).then(data => setData(data.items)).catch(err => console.error(err));
    }
    const makeOptions = i => {
        return (
            <option value={i}>{i}</option>
        );
    }
    const submitReview = () => {
        const video_id = props.id;
        const user_id = loginStatus._id;
        const name = loginStatus.name;
        const title = data.map(video => video.snippet.title)[0];
        const channel = data.map(video => video.snippet.channelTitle)[0];
        const thumbnail = data.map(video => video.snippet.thumbnails.high.url)[0];
        axios.post(`${URL}/reviews/create`, {
            video_id, user_id, name, content, rating, title, channel, thumbnail
        }).then(response => {
            if (response) navigate(`/video/${props.id}`);
            else navigate(`/review/${props.id}`);
        });
    }
    useEffect(() => {
      getSingleVideo();
      axios.get(`${URL}/users/login`).then(response => {
        if (response.data.loggedIn) {
            setLoginStatus(response.data.user);
        }});
    },[]);
    return (
        <>
            {
                data.length != 0 ?
                <>
                    <Header name={loginStatus.name} id={loginStatus._id}/>
                    <div className="review-wrapper" key={props.id}>
                        <Card className="video-card">
                            <Card.Body>
                                <a href={`/video/${props.id}`}><Button className="back-btn" size="sm" variant="danger"><i className="fa-solid fa-angles-left"></i></Button></a>
                                <Card.Title>{data.map(video => video.snippet.title)}</Card.Title>
                                <iframe src={`https://www.youtube.com/embed/${props.id}`} allowFullScreen title='Video player'/>
                                <Card.Text>Channel: {data.map(video => video.snippet.channelTitle)}</Card.Text><hr/>
                                <Card.Text style={{fontSize: '1.5rem'}}><i><b>Create a review</b></i></Card.Text>
                                <Form className="review-form">
                                    <textarea className="review-content" cols="30" rows="10" placeholder="Write a review..." onChange={(e) => setContent(e.target.value)}></textarea>
                                    <select className="form-select form-select-lg mb-3" defaultValue={'DEFAULT'} value={rating} onChange={(e) => setRating(e.target.value)}>
                                        <option value="DEFAULT" disabled>Choose Video Rating(1-10):</option>
                                        {makeOptions(1)}
                                        {makeOptions(2)}
                                        {makeOptions(3)}
                                        {makeOptions(4)}
                                        {makeOptions(5)}
                                        {makeOptions(6)}
                                        {makeOptions(7)}
                                        {makeOptions(8)}
                                        {makeOptions(9)}
                                        {makeOptions(10)}
                                    </select>
                                    <Button variant="primary" onClick={() => submitReview(props.id)}>Submit review</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                </>
                : <NotFound/>
            }
        </>
    );
}
export default Review;