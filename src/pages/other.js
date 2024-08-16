import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import OtherSidebar from '../components/sidebar/other';
import OtherNavMenu from '../components/navmenu/otherNavmenu';
import Footer from '../components/footer';
import './OtherPage.css'; // นำเข้าไฟล์ CSS

const OtherPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap"> 
        <div className="d-flex flex-column flex-md-row">
          <OtherSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <h1>Welcome to Other Page</h1>
            <p>This is the main content area.</p>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default OtherPage;
