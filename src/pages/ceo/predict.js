import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import CeoSidebar from "../../components/sidebar/ceo";
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import './AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS
import ForecastComponentEmp from '../../components/prediction/ForecastComponentEmp';

const CeoPredictPage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ตรวจสอบว่าฟังก์ชัน tos และ รีเซ มีการ import หรือไม่
  // ถ้าไม่จำเป็นต้องใช้ฟังก์ชันนี้ สามารถลบ useEffect นี้ออกได้
  useEffect(() => {
    // ถ้าฟังก์ชัน tos และ รีเซ จำเป็นต้องใช้ ให้ import ฟังก์ชันนี้เข้ามา
    // tos();
    // รีเซ();
  }, []);

  return (
    <div className="page-container">
      <OtherNavMenu handleShow={handleShow} />
      
      <Container fluid className="p-0 content-wrap">
        <div className="">
          <CeoSidebar show={show} handleClose={handleClose} />
          <div className="content-area">
            <ForecastComponentEmp />
            
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default CeoPredictPage;
