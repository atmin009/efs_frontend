import React, { useContext } from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { FaCog, FaBars } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext'; // นำเข้า AuthContext
import './adminNabmenu.css';

const AdminNavMenu = ({ handleShow }) => {
  const { auth, setAuth } = useContext(AuthContext); // ดึงข้อมูลจาก AuthContext

  // ฟังก์ชันการออกจากระบบ
  const handleLogout = () => {
    setAuth({ isLoggedIn: false, user: null }); // รีเซ็ตสถานะการล็อกอิน
    localStorage.removeItem('auth'); // ลบข้อมูลใน localStorage (ถ้ามี)
    window.location.href = '/'; // เปลี่ยนเส้นทางไปที่หน้าแรกหลังจากออกจากระบบ
  };

  return (
<Navbar bg="light" expand="lg" className="navbar-mobile custom-navbar">
      <Container>
        <div className="d-flex justify-content-between align-items-center w-100">
          <FaBars
            className="d-lg-none"
            style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }}
            onClick={handleShow}
          />
          <Navbar.Brand href="/" className="d-lg-flex d-none" style={{ color: '#fff', fontWeight: 'bold' }}>
            ระบบการพยากรณ์การใช้ไฟฟ้า
          </Navbar.Brand>
          <div className="d-flex align-items-center ms-auto">
            <span style={{ color: '#fff', marginRight: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
              {auth.user ? auth.user.name : 'ผู้ใช้'}
            </span>
            <Dropdown align="end">
              <Dropdown.Toggle as="div" style={{ cursor: 'pointer', color: '#fff', fontSize: '20px' }}>
                <FaCog />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/account">บัญชีของฉัน</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>ออกจากระบบ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminNavMenu;
