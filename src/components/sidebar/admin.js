import React from "react";
import { Nav, Offcanvas, NavDropdown } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
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
    <Nav.Link href="/admin">หน้าแรก</Nav.Link>
    <Nav.Link href="/admin/predict">การพยากรณ์ไฟฟ้า</Nav.Link>
    <NavDropdown title="จัดการข้อมูล" id="desktop-nav-dropdown">
      <NavDropdown.Item href="#action/3.1">จำนวน unit ไฟฟ้า</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">จำนวนผู้ใช้ไฟฟ้า</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.3">อาคารและพื้นที่การใช้สอย</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.4">การสอบและเปิดปิดภาคเรียน</NavDropdown.Item>
    </NavDropdown>
    <Nav.Link href="#manageusers">จัดการผู้ใช้งานระบบ</Nav.Link>
  </Nav>
</div>


      {/* Offcanvas สำหรับโหมดมือถือ */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/admin">หน้าแรก</Nav.Link>
            <Nav.Link href="/admin/predict">การพยากรณ์ไฟฟ้า</Nav.Link>
            <NavDropdown title="จัดการข้อมูล" id="mobile-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">จำนวน unit ไฟฟ้า</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">จำนวนผู้ใช้ไฟฟ้า</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">อาคารและพื้นที่การใช้สอย</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">การสอบและเปิดปิดภาคเรียน</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#manageusers">จัดการผู้ใช้งานระบบ</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AdminSidebar;
