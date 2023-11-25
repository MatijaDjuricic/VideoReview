import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import formatDate from '../utilities/formatDate';
const MainPage = () => {
  axios.defaults.withCredentials = true;
  const API_KEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_URL;
  const [data, setData] = useState([]);
  const [loginStatus, setLoginStatus] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const getVideos = async() => {
    const API = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${searchValue}&key=${API_KEY}`;
    await fetch(API).then(res => res.json()).then(data => setData(data.items)).catch(err => console.error(err));
  }
  const viewMore = id => {
    navigate(`/video/${id}`);
  }
  useEffect(() => {
    axios.get(`${URL}/users/logged`).then(response => {
      if (response.data.loggedIn) {
        setLoginStatus(response.data.user);
      }});
  },[]);
  return (
    <>
      <Header name={loginStatus.name} id={loginStatus._id}/>
      <div className='input-wrapper'>
        <InputGroup className='m-2 w-100'>
          <InputGroup.Text id="basic-addon1"><i className="fas fa-search"></i></InputGroup.Text>
          <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} enterPress={getVideos}/>
        </InputGroup>
        <Button variant='danger' size='md' onClick={getVideos}><i className="fas fa-search"></i></Button>
      </div>
      <div className='container'>
        {
          data.length != 0 ?
          data.map(video => (
            <Card className="videos-card" key={video.id.videoId}>
              <Card.Img variant="top"/>
              <Card.Body>
                <Card.Title>{video.snippet.title}</Card.Title>
                <Card.Img src={video.snippet.thumbnails.high.url} alt="Card image" />
                <Card.Text>{video.snippet.description}</Card.Text>
                <Card.Text>Channel: {video.snippet.channelTitle}</Card.Text>
                <Card.Text>Published at: {formatDate(video.snippet.publishedAt)}</Card.Text>
                <Button className="vm-btn" variant="primary" onClick={() => viewMore(video.id.videoId)}>View more</Button>
              </Card.Body>
            </Card>
          )) :
          <p className='no-search-results'><strong>No search results yet</strong>,<br />please search to get results</p>
        }
      </div>
    </>
  );
}
export default MainPage;