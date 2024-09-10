import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import EmpSidebar from '../../components/sidebar/employee'
import OtherNavMenu from '../../components/navmenu/adminNabmenu';
import Footer from '../../components/footer';
import './AdminPredictPage.css';
import AddUnitTable from '../../components/manages/AddUnitTable';
function EmpAddUnitPages() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  return (
    <div className="page-container">
    <OtherNavMenu handleShow={handleShow} />
    
    <Container fluid className="p-0 content-wrap">
      <div className="">
        <EmpSidebar show={show} handleClose={handleClose} />
        <div className="content-area">
          <AddUnitTable />
        </div>
      </div>
    </Container>

    <Footer />
  </div>
  );
}

export default EmpAddUnitPages;
