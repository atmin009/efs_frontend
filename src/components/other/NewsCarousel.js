import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import './NewsCarousel.css';
import { TiArrowLeftThick, TiArrowRightThick } from 'react-icons/ti';
import { Link } from 'react-router-dom';
import chatAnimation from '../../icons/chat_15578584.json';  // นำเข้าไฟล์ JSON
import Lottie from 'react-lottie-player';
import BASE_URL from '../../api';
const NewsCarousel = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
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

  const settings = {
    dots: true,
    infinite: false,  // ไม่ทำซ้ำวนลูป
    speed: 500,
    slidesToShow: Math.min(newsList.length, 3),  // แสดงการ์ดตามจำนวนข่าวที่มีจริง (สูงสุด 3 ใบ)
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,  // หน้าจอขนาดใหญ่
        settings: {
          slidesToShow: Math.min(newsList.length, 3),
          slidesToScroll: 1,
          infinite: false,
        }
      },
      {
        breakpoint: 768,  // หน้าจอขนาดกลาง (เช่น แท็บเล็ต)
        settings: {
          slidesToShow: Math.min(newsList.length, 2),
          slidesToScroll: 1,
          infinite: false,
        }
      },
      {
        breakpoint: 480,  // หน้าจอขนาดเล็ก (เช่น มือถือ)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        }
      }
    ]
  };

  return (
    <div style={{ margin: '20px' }}>
    <div className='header1'><Lottie
        loop
        animationData={chatAnimation}  // ใช้แอนิเมชันจากไฟล์ JSON
        play
        style={{ width: 50, height: 50 }}  // ขนาดของไอคอน
      />
      <h3>ประชาสัมพันธ์</h3></div>
     
      <Slider {...settings}>
        {newsList.map((news) => (
          <div key={news.id}>
            <div className="news-card">
              {/* ใส่ลิงก์ที่ห่อทั้งภาพและหัวข้อข่าว */}
              <Link to={`/news/${news.id}`} className="news-link">
                <div className="news-image">
                  <img
                    src={`${BASE_URL}/images/${news.cover_image}`}
                    alt={news.title}
                  />
                </div>
                <h3 className="news-title">{news.title}</h3>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// ปุ่มลูกศรขวา (ถัดไป)
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}  // ใช้ className ให้ตรงตาม Slick
      onClick={onClick}
    >
      <TiArrowRightThick className="arrow-icon" />
    </div>
  );
};

// ปุ่มลูกศรซ้าย (ย้อนกลับ)
const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}  // ใช้ className ให้ตรงตาม Slick
      onClick={onClick}
    >
      <TiArrowLeftThick className="arrow-icon" />
    </div>
  );
};

export default NewsCarousel;
