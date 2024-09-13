import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; //
function CollapsibleExample({ setLgShow, loginShow }) {
  // ใช้ loginShow ตรงนี้
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      style={{
        backgroundColor: "#4D0067",
        fontFamily: "Anuphan",
      }}
    >
      <Container>
        <Navbar.Brand href="/" style={{ color: "white" }}>
          ระบบการพยากรณ์การใช้ไฟฟ้า
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          style={{
            borderColor: "rgba(255, 255, 255, 0.55)", // เพิ่ม border color เพื่อให้มองเห็นได้ชัดเจนขึ้น
          }}
        >
          <span
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='rgba%28255, 255, 255, 1%29' stroke-width='2' stroke-linecap='round' stroke-miterlimit='10' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E\")",
              display: "block",
              width: "30px",
              height: "30px",
            }}
          ></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{ color: "white" }}>
              หน้าแรก
            </Nav.Link>
            <Nav.Link as={Link} to="#about" style={{ color: "white" }}>
              เกี่ยวกับเรา
            </Nav.Link>
            <Nav.Link as={Link} to="/knowhow" style={{ color: "white" }}>
              คู่มือการใช้งานระบบ
            </Nav.Link>
          </Nav>
          <Nav>
            <Link
              to="/register"
              className="nav-link"
              style={{ color: "white" }}
            >
              สมัครสมาชิก
            </Link>
            <Nav.Link
              style={{ color: "white" }}
              onClick={() => loginShow(true)} // ใช้ loginShow ตรงนี้
            >
              เข้าสู่ระบบ
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
