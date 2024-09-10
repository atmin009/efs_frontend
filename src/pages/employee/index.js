import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import EmpSidebar from '../../components/sidebar/employee'
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import '../admin/AdminPredictPage.css'; // เปลี่ยนชื่อไฟล์ CSS

import CarbonFootprintCalculator from '../../components/other/CarbonFootprintCalculator ';
import QuarterlySummary from '../../components/other/BuildingAmountSummary';
function EmployeePage() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  return (
    <div className="page-container">
    <OtherNavMenu handleShow={handleShow} />
    
    <Container fluid className="p-0 content-wrap">
      <div className="">
        <EmpSidebar show={show} handleClose={handleClose} />
        <div className="content-area1">
          <div  className="gb1">          <QuarterlySummary></QuarterlySummary> 
</div>
          <CarbonFootprintCalculator/>        
          </div>
      </div>
    </Container>

    <Footer />
  </div>
  );
}

export default EmployeePage;
