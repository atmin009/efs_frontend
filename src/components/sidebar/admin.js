import React from "react";
import { Nav, Offcanvas, NavDropdown } from "react-bootstrap";
import { FaBars, FaHome, FaChartLine, FaDatabase, FaUserCog } from "react-icons/fa";
import "./admin.css";

const AdminSidebar = ({ show, handleClose, handleShow }) => {
  return (
    <>
      {/* ปุ่มแฮมเบอร์เกอร์สำหรับเปิด Offcanvas */}
      <div className="d-md-none">
        <FaBars
          onClick={handleShow}
          style={{ cursor: "pointer", color: "#fff" }}
        />
      </div>

      {/* Sidebar สำหรับ Desktop */}
      <div className="d-none d-md-block bg-light custom-sidebar">
        <div className="text-center mb-4">
        </div>
        <Nav className="flex-column" style={{ fontFamily: "Anuphan" }}>
          <img src="/logo/logo.png" alt="Logo" style={{ width: "100%", marginBottom: "20px" }} />
          
          <Nav.Link href="/admin">
            <FaHome style={{ marginRight: "8px" }} />
            หน้าแรก
          </Nav.Link>
          
          <Nav.Link href="/admin/predict">
            <FaChartLine style={{ marginRight: "8px" }} />
            การพยากรณ์ไฟฟ้า
          </Nav.Link>
          
          <NavDropdown title={<><FaDatabase style={{ marginRight: "8px" }} /> จัดการข้อมูล</>} id="desktop-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">
              <FaChartLine style={{ marginRight: "8px" }} />
              จำนวน unit ไฟฟ้า
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              <FaChartLine style={{ marginRight: "8px" }} />
              จำนวนผู้ใช้ไฟฟ้า
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">
              <FaDatabase style={{ marginRight: "8px" }} />
              อาคารและพื้นที่การใช้สอย
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.4">
              <FaDatabase style={{ marginRight: "8px" }} />
              การสอบและเปิดปิดภาคเรียน
            </NavDropdown.Item>
          </NavDropdown>
          
          <Nav.Link href="#manageusers">
            <FaUserCog style={{ marginRight: "8px" }} />
            จัดการผู้ใช้งานระบบ
          </Nav.Link>

        </Nav>
        <div className="text-center mt-4" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
  <img src="/et1.png" alt="ET1" style={{ width: "100%" }} />
</div>

      </div>

      {/* Offcanvas สำหรับโหมดมือถือ */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/admin">
              <FaHome style={{ marginRight: "8px" }} />
              หน้าแรก
            </Nav.Link>
            <Nav.Link href="/admin/predict">
              <FaChartLine style={{ marginRight: "8px" }} />
              การพยากรณ์ไฟฟ้า
            </Nav.Link>
            <NavDropdown title={<><FaDatabase style={{ marginRight: "8px" }} /> จัดการข้อมูล</>} id="mobile-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                <FaChartLine style={{ marginRight: "8px" }} />
                จำนวน unit ไฟฟ้า
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                <FaChartLine style={{ marginRight: "8px" }} />
                จำนวนผู้ใช้ไฟฟ้า
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                <FaDatabase style={{ marginRight: "8px" }} />
                อาคารและพื้นที่การใช้สอย
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">
                <FaDatabase style={{ marginRight: "8px" }} />
                การสอบและเปิดปิดภาคเรียน
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#manageusers">
              <FaUserCog style={{ marginRight: "8px" }} />
              จัดการผู้ใช้งานระบบ
            </Nav.Link>

          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AdminSidebar;
