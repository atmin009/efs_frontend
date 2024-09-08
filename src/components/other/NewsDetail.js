import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import CollapsibleExample from '../navmenu';
import BASE_URL from '../../api';
const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [setLnShow] = useState(false);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news detail:', error);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (!news) return (
    <Container className="text-center" style={{ marginTop: '50px' }}>
      <Spinner animation="border" role="status">
      </Spinner>
      <p>Loading...</p>
    </Container>
  );

  return (
    <div>
      <CollapsibleExample loginShow={setLnShow} />
      
      <Container style={{ fontFamily: 'Anuphan, sans-serif', marginTop: '20px' }}>
        <Row>
          <Col>
            <h1 style={{ fontWeight: 700, marginBottom: '20px' }}>{news.title}</h1>
          </Col>
        </Row>

        <Row>
          <Col md={50}>
            <img
              src={`${BASE_URL}/images/${news.cover_image}`}
              alt={news.title}
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
            />
          </Col>
        </Row>

        <Row>
          <Col md={50}>
            {/* ใช้ dangerouslySetInnerHTML เพื่อแสดง HTML จาก CKEditor */}
            <div
              style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '30px' }}
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Button
              href={`${BASE_URL}/images/${news.attachment}`}
              download
              variant="primary"
              style={{ backgroundColor: '#0d6efd', border: 'none' }}
            >
              โหลดไฟล์แนบ
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewsDetail;
