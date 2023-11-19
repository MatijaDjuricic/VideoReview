import React, { useState, useEffect } from 'react';
import { Offcanvas, Stack, Card } from 'react-bootstrap';
import axios from 'axios';
import formatDate from '../utilities/formatDate';
import './SideBar.css';
const SideBar = ({ isOpen, closeSideBar, user_id }) => {
  axios.defaults.withCredentials = true;
  const URL = import.meta.env.VITE_URL;
  const [videosData, setVideosData] = useState([]);
  const getReviews = async() => {
    await axios.get(`${URL}/reviews/user/${user_id}`).then(response => {
      if (response.data.review) {
        setVideosData(response.data.review.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    });
  }
  useEffect(() => {
    getReviews();
  },[]);
  return (
    <Offcanvas show={isOpen} onHide={closeSideBar} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Reviews</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {
            videosData.length != 0 ?
            videosData.map(review => (
              <Card className="review-card" key={review._id}>
                <Card.Img variant="top" />
                <Card.Body>
                  <Card.Title>{review.title}</Card.Title>
                  <Card.Img src={review.thumbnail} alt="card image" />
                  <Card.Text>Channel: {review.channel}</Card.Text>
                  <Card.Text>Created At: {formatDate(review.createdAt)}</Card.Text>
                </Card.Body>
                <div className="review-overlay">
                  <a href={`/video/${review.video_id}`}><button className="open-review-btn">View Review</button></a>
                </div>
              </Card>
            )) :
            <p>There are no <b><i>reviews</i></b> on this account yet</p>
          }
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
export default SideBar;