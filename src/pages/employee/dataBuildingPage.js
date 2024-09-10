import React, { useState } from 'react';
import DataBuilding from "../../components/manages/building";
import { Container } from 'react-bootstrap';
import EmpSidebar from '../../components/sidebar/employee'
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import './AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS

function EmpBuildingPage() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap">
        <div className="">
          <EmpSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <DataBuilding />
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default EmpBuildingPage;
