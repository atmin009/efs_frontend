import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function LoginModal({ lnShow, loginShow }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginError, setLoginError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const userStatus = data.status;

        // ตรวจสอบสถานะและเปลี่ยนหน้าไปยังไฟล์ต่างๆ
        switch (userStatus) {
          case 0:
            window.location.href = '../../pages/admin';
            break;
          case 1:
            window.location.href = '../../pages/employee';
            break;
          case 2:
            window.location.href = '../../pages/ceo';
            break;
          case 3:
            window.location.href = '../../pages/other';
            break;
          default:
            setLoginError('สถานะผู้ใช้ไม่ถูกต้อง');
            break;
        }
      } else {
        const errorData = await response.json();
        setLoginError(errorData.detail || 'การเข้าสู่ระบบล้มเหลว');
      }
    } catch (error) {
      setLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
  };

  return (
    <Modal
      size="lg"
      show={lnShow}
      onHide={() => loginShow(false)}
      aria-labelledby="example-modal-sizes-title-lg"
      style={{ fontFamily: 'Anuphan' }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          เข้าสู่ระบบ
        </Modal.Title>
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
        </Form>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
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
