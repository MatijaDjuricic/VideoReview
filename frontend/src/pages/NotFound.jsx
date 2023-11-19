import React from 'react';
import Header from '../components/Header';
import not_found from '../assets/not_found.png';
const NotFound = () => {
  return (
    <>
      <Header/>
      <div className="not-found">
        <img src={not_found} alt="404"/>
        <p><strong>Oops!</strong><br/></p>
        <p className='no-results'>PAGE NOT FOUND!</p>
      </div>
    </>
  );
}
export default NotFound;