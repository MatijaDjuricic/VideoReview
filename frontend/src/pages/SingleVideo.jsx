import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import formatLongText from "../utilities/formatLongText";
import formatDate from '../utilities/formatDate';
import NotFound from "./NotFound";
const SingleVideo = props => {
  axios.defaults.withCredentials = false;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_URL;
  const [data, setData] = useState([]);
  const [loginStatus, setLoginStatus] = useState([]);
  const [review, setReview] = useState([]);
  const navigate = useNavigate();
  const [videoReviewed, setVideoReviewed] = useState(false);
  const [isLong, setIsLong] = useState(false);
  const getSingleVideo = async() => {
    const API = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${props.id}&key=${API_KEY}`;
    await fetch(API).then(res => res.json()).then(data => setData(data.items)).catch(err => console.error(err));
  }
  const getReview = () => {
    axios.get(`${URL}/users/login`).then(response => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user);
        const user_id = response.data.user._id;
        axios.get(`${URL}/reviews/review/${props.id}`).then(response => {
          if (response.data.review) {
            setReview(response.data.review.sort((a, b) => {
              if (a.createdAt > b.createdAt) return -1;
              else return 0;
            }).sort(a => {
              if (a.user_id == user_id) return -1;
              else return 0;
            }));
            response.data.review.forEach(review => {
              if (review.user_id === user_id) setVideoReviewed(true);
            });
          } else setVideoReviewed(false);
        });
      }
    });
  }
  const deleteReview = async id => {
    await axios.delete(`${URL}/reviews/review/delete/${id}`).then(response => {
      if (response.data) window.location.reload();
    });
  }
  const averageVideoRating = length => {
    var sum = 0;
    for(var i = 0; i < length; i++) {
      sum += review[i].rating;
    }
    return (sum / length).toFixed(2);
  }
  const handleClick = () => isLong ? setIsLong(false) : setIsLong(true);
  const goToReview = id => navigate(`/review/${id}`);
  useEffect(() => {
    getSingleVideo();
    getReview();
  },[]);
  return (
      <>
        {
          data.length != 0 ?
          <>
            <Header name={loginStatus.name} id={loginStatus._id}/>
            <div className="single-video" key={props.id}>
              <Card className="video-card">
                  <Card.Body>
                    <a href="/"><Button className="back-btn" size="sm" variant="danger"><i className="fa-solid fa-angles-left"></i></Button></a>
                    <Card.Title>{data.map(video => video.snippet.title)}</Card.Title>
                    <iframe src={`https://www.youtube.com/embed/${props.id}`} allowFullScreen title='Video player'/>
                    <Card.Text className="description">Description:<br/>
                    {
                      !isLong ? data.map(video => formatLongText(video.snippet.description, 400, handleClick)) :
                      <>
                        {data.map(video => video.snippet.description)}<br/>
                        <a className="sv-a" onClick={handleClick}>Collapse To Read Less <i className="fa-solid fa-chevron-up"></i></a>
                      </>
                    }
                    </Card.Text>
                    <Card.Text>Channel: {data.map(video => video.snippet.channelTitle)}</Card.Text>
                    <Card.Text>Published at: {data.map(video => formatDate(video.snippet.publishedAt))}</Card.Text>
                    {
                      videoReviewed ?
                      <>
                        <Button variant="secondary">Reviewed</Button><hr/>
                      </>
                      :
                      <>
                        <Button variant="primary" onClick={() => goToReview(props.id)}>Add review</Button><hr />
                      </>
                    }
                    <div className="reviews-wrapper">
                      {
                        review.length != 0 ?
                        <>
                          <Card.Text style={{fontSize: '1.5rem'}}><i><b>All Reviews</b></i></Card.Text>
                          <Card.Text><i>Average video rating: </i><b>{averageVideoRating(review.length)}/10</b></Card.Text>
                          {
                            review.map(review => (
                              <div className="review-div" key={review._id}>
                                <Card>
                                  <Card.Body>
                                    <Card.Text><i>Author: <b>{loginStatus.name == review.name ? <a className="sv-a" href={`/profile/${loginStatus._id}`}>{review.name}(you)</a> : review.name}</b></i> ({formatDate(review.createdAt)})</Card.Text>
                                    <Card.Text><i><b>Review: </b></i>{review.content}</Card.Text>
                                    {
                                      loginStatus.name == review.name ?
                                      <Button className="dr-btn" variant="danger" size="sm" title="Delete review" onClick={() => deleteReview(review._id)}><i className="fa fa-trash"></i></Button>
                                      : null
                                    }
                                    <Card.Text className="single-video-rating"><i><b>Video rating: </b></i>{review.rating}/10</Card.Text>
                                  </Card.Body>
                                </Card>
                              </div>
                            ))
                          }
                        </> : <p>There are no <b><i>reviews</i></b> for this video yet</p>
                      }
                    </div>
                  </Card.Body>
              </Card>
            </div>
          </> : <NotFound/>
        }
    </>
  );
}
export default SingleVideo;