import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import BASE_URL from "../../api";
function LoginModal({ lnShow, loginShow }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(""); // เพิ่มสถานะสำหรับอีเมลลืมรหัสผ่าน
  const navigate = useNavigate();

  // ใช้ useContext ในการดึง authContext
  const authContext = useContext(AuthContext);
  const setAuth = authContext ? authContext.setAuth : () => {};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    console.log("Form data being sent:", formData); // ตรวจสอบข้อมูลที่ส่งไปยังเซิร์ฟเวอร์

    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Server response status:", response.status); // แสดงสถานะการตอบสนอง

      if (response.ok) {
        const data = await response.json();
        const { user_id, username, status, name } = data;

        // อัปเดต AuthContext
        setAuth({
          isLoggedIn: true,
          user: { user_id, username, status, name },
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ user_id, username, status, name })
        );
        loginShow(false);

        // เปลี่ยนเส้นทางตาม status
        switch (status) {
          case 0:
            navigate("/admin");
            break;
          case 1:
            navigate("/employee");
            break;
          case 2:
            navigate("/ceo");
            break;
          case 3:
            navigate("/other");
            break;
          default:
            setLoginError("สถานะผู้ใช้ไม่ถูกต้อง");
            break;
        }
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // แสดงข้อมูล error ที่เซิร์ฟเวอร์ตอบกลับมา
        setLoginError(errorData.detail || "การเข้าสู่ระบบล้มเหลว");
      }
    } catch (error) {
      console.error("Error during login:", error); // แสดงข้อผิดพลาดที่เกิดขึ้นในขณะทำการ login
      setLoginError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      setLoginError("กรุณากรอกอีเมล");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      if (response.ok) {
        setLoginError("คำขอลืมรหัสผ่านถูกส่งไปที่อีเมลแล้ว");
      } else {
        const errorData = await response.json();
        setLoginError(errorData.detail || "ไม่สามารถส่งคำขอลืมรหัสผ่านได้");
      }
    } catch (error) {
      setLoginError("เกิดข้อผิดพลาดในการส่งคำขอลืมรหัสผ่าน");
    }
  };

  return (
    <Modal
      size="lg"
      show={lnShow}
      onHide={() => loginShow(false)}
      aria-labelledby="example-modal-sizes-title-lg"
      style={{ fontFamily: "Anuphan" }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">เข้าสู่ระบบ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="username">
            <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="กรอกชื่อผู้ใช้งาน"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>รหัสผ่าน</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="กรอกรหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="link"
              style={{ padding: 0 }}
              as={Link}
              to="/forget-password"
            >
              ลืมรหัสผ่าน?
            </Button>
          </div>
        </Form>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => loginShow(false)}>
          ปิด
        </Button>
        <Button variant="primary" onClick={handleLogin}>
          เข้าสู่ระบบ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
