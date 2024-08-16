import React from 'react';
import { Nav, Offcanvas } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import './other.css';

const OtherSidebar = ({ show, handleClose, handleShow }) => {
  return (
    <>
      {/* ปุ่มแฮมเบอร์เกอร์สำหรับเปิด Offcanvas */}
      <div className="d-md-none">
        <FaBars onClick={handleShow} style={{ cursor: 'pointer', color: '#fff' }} />
      </div>

      {/* Sidebar สำหรับ Desktop */}
      <div className="d-none d-md-block bg-light custom-sidebar">
        <Nav className="flex-column" style={{ fontFamily: 'Anuphan' }}>
          <Nav.Link href="#dashboard">Dashboard</Nav.Link>
          <Nav.Link href="#components">Components</Nav.Link>
        </Nav>
      </div>

      {/* Offcanvas สำหรับโหมดมือถือ */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            <Nav.Link href="#components">Components</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default OtherSidebar;
