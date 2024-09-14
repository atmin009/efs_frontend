import React from 'react';
import './CoverImage.css'; // นำเข้าไฟล์ CSS

function UncontrolledExample() {
  return (
    <img
    className="cover-image"
    src="/cover.jpg" 
      alt="Cover"
    />
  );
}

export default UncontrolledExample;
