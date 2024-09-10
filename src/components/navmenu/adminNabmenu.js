import React, { useState, useContext } from 'react';
import { Navbar, Container, Dropdown } from 'react-bootstrap';
import { FaCog, FaBars } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext
import SettingsModal from './SettingsModal';
import './adminNabmenu.css';

const AdminNavMenu = ({ handleShow }) => {
  const { auth, setAuth } = useContext(AuthContext); // Access AuthContext
  const [showSettings, setShowSettings] = useState(false); // State to control modal visibility
  const [selectedUser, setSelectedUser] = useState(auth.user); // Track the selected user

  // Function to handle logout
  const handleLogout = () => {
    setAuth({ isLoggedIn: false, user: null }); // Reset login status
    localStorage.removeItem('auth'); // Remove data from localStorage
    window.location.href = '/'; // Redirect to the homepage
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="navbar-mobile custom-navbar">
        <Container>
          <div className="d-flex justify-content-between align-items-center w-100">
            <FaBars
              className="d-lg-none"
              style={{ cursor: 'pointer', color: '#FFFFFF', fontSize: '20px' }}
              onClick={handleShow}
            />

            <div className="d-flex align-items-center ms-auto">
              <span style={{ color: '#FFFFFF', marginRight: '5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                {auth.user ? auth.user.name : 'ผู้ใช้'}
              </span>
              <Dropdown align="end">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer', color: '#000', fontSize: '20px' }}>
                  <FaCog />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setShowSettings(true)}>
                    บัญชีของฉัน
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>
                    ออกจากระบบ
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Settings Modal */}
      <SettingsModal
        show={showSettings}
        handleClose={() => setShowSettings(false)}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
    </>
  );
};

export default AdminNavMenu;
