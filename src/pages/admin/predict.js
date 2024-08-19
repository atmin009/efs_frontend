// AdminPredictPage.jsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import OtherSidebar from '../../components/sidebar/admin';
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import ForecastComponent1 from '../../components/prediction/ForecastComponent1';
import './AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS

const AdminPredictPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap">
        <div className="">
          <OtherSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <ForecastComponent1 />
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default AdminPredictPage;

