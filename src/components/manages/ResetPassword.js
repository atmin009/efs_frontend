import React, { useState } from "react";
import { Button, Form, Container, Row, Col, Image, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CollapsibleExample from '../../components/navmenu'; 
import LoginModal from '../modals/login';
import BASE_URL from "../../api";
function ResetPassword() {
  const [lnShow, setLnShow] = useState(false);

  const { id, token } = useParams();  // ดึง id และ token จาก URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/reset-password/${id}/${token}`, { password });
      setMessage('Password reset successfully');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <CollapsibleExample loginShow={setLnShow} />
      <LoginModal lnShow={lnShow} loginShow={setLnShow} />

      <Container fluid className="p-0">
        <Row className="m-0">
          <Col lg={8} className="d-none d-lg-block p-0">
            <Image
              src="/img2.jpg"
              fluid
              style={{ height: "100vh", objectFit: "cover", width: "100%" }}
            />
          </Col>
          <Col lg={4} xs={12} className="p-4 mt-6" style={{ fontFamily: "Anuphan" }}>
            <h2 className="text-center mb-4">เปลี่ยนรหัสผ่าน</h2>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>รหัสผ่านใหม่</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="กรอกรหัสผ่านใหม่"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>ยืนยัน รหัสผ่านใหม่</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" size="lg">
                ยืนยัน
                </Button>
              </div>
            </Form>

            <ToastContainer position="top-end" className="p-3">
              <Toast show={!!message} onClose={() => setMessage('')} bg="success" delay={3000} autohide>
                <Toast.Header>
                  <strong className="me-auto">สำเร็จ</strong>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
              </Toast>

              <Toast show={!!error} onClose={() => setError('')} bg="danger" delay={3000} autohide>
                <Toast.Header>
                  <strong className="me-auto">ข้อผิดพลาด</strong>
                </Toast.Header>
                <Toast.Body>{error}</Toast.Body>
              </Toast>
            </ToastContainer>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ResetPassword;
