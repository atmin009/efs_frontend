import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axios from 'axios';
import BASE_URL from '../../api';
const NewsList = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลข่าวจาก API
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/news`);
        setNewsList(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  // การตั้งค่าของ Slider (react-slick)
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // จำนวนการ์ดที่แสดงพร้อมกัน
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>ประชาสัมพันธ์</h2>
      <Slider {...sliderSettings}>
      {newsList.map((news) => (
  <div key={news.id} style={{ padding: '0 10px' }}>
    <Link to={`/news/${news.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={cardStyle}>
        <img
          src={`${BASE_URL}/images/${news.cover_image}`}
          alt={news.title}
          style={imageStyle}
        />
        <h3 style={titleStyle}>{news.title}</h3>
      </div>
    </Link>
  </div>
))}

      </Slider>
    </div>
  );
};

// สไตล์สำหรับการ์ดและภาพ
const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '10px',
  textAlign: 'center',
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '10px 0',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default NewsList;
