import Carousel from 'react-bootstrap/Carousel';
import React from 'react';

function UncontrolledExample() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/cover1.jpg" 
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/cover2.jpg" 
          alt="Second slide"
        />
      </Carousel.Item>

    </Carousel>
  );
}

export default UncontrolledExample;
