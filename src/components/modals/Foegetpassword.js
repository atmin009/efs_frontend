import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Image, Toast, ToastContainer, Badge } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../api";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [sumInput, setSumInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  const generateRandomNumbers = () => {
    const number1 = Math.floor(Math.random() * 10);
    const number2 = Math.floor(Math.random() * 10);
    setNum1(number1);
    setNum2(number2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (parseInt(sumInput) !== num1 + num2) {
      setError("ผลลัพธ์ไม่ถูกต้อง กรุณาลองอีกครั้ง");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/forgot-password/`,
        { email }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("โปรดลองอีกครั้ง");
      }
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col lg={8} className="d-none d-lg-block p-0">
          <Image
            src="/img1.jpg"
            fluid
            style={{ height: "100vh", objectFit: "cover", width: "100%" }}
          />
        </Col>
        <Col lg={4} xs={12} className="p-4 mt-6" style={{ fontFamily: "Anuphan" }} >
          <h2 className="text-center mb-4">ลืมรหัสผ่าน</h2>

          <form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="กรอกอีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="sum">
              <Form.Label>
                กรุณากรอกผลลัพธ์ของ{" "}
                <Badge pill bg="primary">{num1}</Badge>{" "}
                +{" "}
                <Badge pill bg="primary">{num2}</Badge>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="กรอกผลลัพธ์"
                value={sumInput}
                onChange={(e) => setSumInput(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                ยืนยันการเปลี่ยนรหัสผ่าน
              </Button>
            </div>
          </form>

          <ToastContainer position="top-end" className="p-3">
            <Toast show={!!message} onClose={() => setMessage('')} bg="success" delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">ส่งสำเร็จ กรุณาตรวจสอบ Email</strong>
              </Toast.Header>
              <Toast.Body>{message}</Toast.Body>
            </Toast>

            <Toast show={!!error} onClose={() => setError('')} bg="danger" delay={3000} autohide>
              <Toast.Header>
                <strong className="me-auto">ข้อผิดพลาดกรุณาติดต่อเจ้าหน้าที่</strong>
              </Toast.Header>
              <Toast.Body>{error}</Toast.Body>
            </Toast>
          </ToastContainer>
          
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
