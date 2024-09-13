import React, { useEffect, useState } from 'react';

  const KnowHow = () => {
    const [videos, setVideos] = useState([]);
    const [hovered, setHovered] = useState(null); // เก็บ ID วิดีโอที่ถูก Hover
  
    useEffect(() => {
      fetch('/videos.json')
        .then((response) => response.json())
        .then((data) => setVideos(data))
        .catch((error) => console.error('Error fetching videos:', error));
    }, []);
  
  return (
    <div style={styles.container}>
              <h3>Knowhow : คู่มือการใช้งานเว็บไซต์</h3>

              {videos.map((video) => (
        <div
          key={video.id}
          style={{
            ...styles.videoCard,
            ...(hovered === video.id ? styles.videoCardHover : {}),
          }}
          onMouseEnter={() => setHovered(video.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            style={styles.thumbnail}
          />
          <div style={styles.videoDetails}>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.videoLink}
            >
              <h3 style={styles.videoTitle}>{video.title}</h3>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f5',
  },
  videoCard: {
    display: 'flex',
    alignItems: 'center',
    width: '80%',
    margin: '15px 0',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  thumbnail: {
    width: '200px',
    height: '120px',
    borderRadius: '10px',
    marginRight: '20px',
  },
  videoDetails: {
    flex: 1,
  },
  videoLink: {
    textDecoration: 'none',
    color: '#333',
  },
  videoTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0',
    transition: 'color 0.3s',
  },
  videoCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
};

export default KnowHow;
