import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Stack, Card } from 'react-bootstrap';
import axios from 'axios';
import formatDate from '../utilities/formatDate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './SideBar.css';
const SideBar = ({ isOpen, closeSideBar, user_id }) => {
  axios.defaults.withCredentials = true;
  const URL = import.meta.env.VITE_URL;
  const [videosData, setVideosData] = useState([]);
  const pdfRef = useRef();
  const getReviews = async() => {
    await axios.get(`${URL}/reviews/user/${user_id}`).then(response => {
      if (response.data.review) {
        setVideosData(response.data.review.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      }
    });
  }
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, 'PNG', imgX, imgY, (imgWidth * ratio) - imgWidth / 10, (imgWidth * ratio)) - imgWidth / 10;
      pdf.save("reviews.pdf");
    });
  }
  useEffect(() => {
    getReviews();
  },[]);
  return (
    <Offcanvas show={isOpen} onHide={closeSideBar} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Your Reviews</Offcanvas.Title>
        { videosData.length != 0 ? <button className='download-btn' onClick={downloadPDF}>Download PDF</button> : null }
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack ref={pdfRef} gap={3}>
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