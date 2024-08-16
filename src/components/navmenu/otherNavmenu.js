import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaCog, FaBars } from 'react-icons/fa';
import './otherNavmenu.css';

const OtherNavMenu = ({ handleShow }) => {
    return (
      <Navbar bg="light" expand="lg" className="navbar-mobile" style={{ 
          backgroundColor: '#4D0067', 
          fontFamily: 'Anuphan',
          color: '#fff',
          padding: '10px' // เพิ่ม padding ตัวอย่าง
        }}>
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
            <FaBars className="d-lg-none" style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }} onClick={handleShow} />
            <Navbar.Brand href="/" className="d-lg-flex d-none" style={{ color: '#fff', fontWeight: 'bold' }}>ระบบการพยากรณ์การใช้ไฟฟ้า</Navbar.Brand>
            <Dropdown align="end" className="d-lg-none ms-auto">
              <Dropdown.Toggle as="div" style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }}>
                <FaCog />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/account">บัญชีของฉัน</Dropdown.Item>
                <Dropdown.Item href="#/logout">ออกจากระบบ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Dropdown align="end" className="d-none d-lg-block">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }}>
                  <FaCog />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/account">บัญชีของฉัน</Dropdown.Item>
                  <Dropdown.Item href="#/logout">ออกจากระบบ</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  };
  
  export default OtherNavMenu;
  