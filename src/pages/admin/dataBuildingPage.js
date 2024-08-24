import React, { useState } from 'react';
import DataBuilding from "../../components/manages/DataBuilding";
import { Container } from 'react-bootstrap';
import OtherSidebar from '../../components/sidebar/admin';
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import './AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS

function DataBuildingPage() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap">
        <div className="">
          <OtherSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <DataBuilding />
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default DataBuildingPage;
