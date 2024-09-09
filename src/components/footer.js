import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white">
      <Container>
        <Row className="text-center py-3"style={{fontFamily: 'Anuphan' }}>
          <Col>
            <p className="mb-0">&copy; {new Date().getFullYear()} ส่วนบริการกลาง มหาวิทยาลัยวลัยลักษณ์. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
