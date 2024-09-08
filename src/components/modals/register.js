import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Image } from 'react-bootstrap';
import BASE_URL from '../../api';
function RegisterComponent() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fname: '',
    lname: '',
    email: '',
    phone: ''
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errors, setErrors] = useState({});
  const [formattedPhone, setFormattedPhone] = useState('');

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setFormattedPhone(formattedValue);
      setFormData({ ...formData, [name]: value.replace(/[^\d]/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(
        name === 'password'
          ? value === formData.confirmPassword
          : formData.password === value
      );
    }
    
    validateField(name, name === 'phone' ? value.replace(/[^\d]/g, '') : value);
  };

  const validateField = (fieldName, value) => {
    let newErrors = { ...errors };
    switch (fieldName) {
      case 'email':
        newErrors.email = validateEmail(value) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง';
        break;
      case 'phone':
        newErrors.phone = value.length === 10 ? '' : 'เบอร์โทรศัพท์ต้องมี 10 หลัก';
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // Validate all fields before submitting
    Object.keys(formData).forEach(key => validateField(key, formData[key]));
    if (Object.values(errors).some(error => error !== '')) {
      console.log('Form has errors, please correct them');
      return;
    }

    const memberData = {
      username: formData.username,
      password: formData.password,
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      status: 3
    };

    try {
      const response = await fetch(`${BASE_URL}/members/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(memberData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        alert('สมัครสมาชิกเรียบร้อยแล้ว');
        // Reset form or redirect user
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        alert('การสมัครสมาชิกล้มเหลว: ' + (errorData.detail || ''));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col lg={8} className="d-none d-lg-block p-0">
          <Image src="https://dcc.wu.ac.th/wp-content/uploads/2022/11/01-wu.jpg" fluid style={{height: '100vh', objectFit: 'cover', width: '100%'}} />
        </Col>
        <Col lg={4} xs={12} className="p-4" style={{ fontFamily: 'Anuphan' }}>
          <h2 className="text-center mb-4">สมัครสมาชิก</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="กรอกชื่อผู้ใช้งาน"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>รหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="กรอกรหัสผ่าน"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>ยืนยันรหัสผ่าน</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="กรอกยืนยันรหัสผ่าน"
                value={formData.confirmPassword}
                onChange={handleChange}
                isInvalid={!passwordMatch}
                required
              />
              {!passwordMatch && (
                <Form.Control.Feedback type="invalid">
                  รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>ชื่อ</Form.Label>
                  <Form.Control
                    type="text"
                    name="fname"
                    placeholder="กรอกชื่อ"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>นามสกุล</Form.Label>
                  <Form.Control
                    type="text"
                    name="lname"
                    placeholder="กรอกนามสกุล"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="กรอกอีเมล"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>เบอร์โทรศัพท์</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="กรอกเบอร์โทรศัพท์"
                value={formattedPhone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                สมัครสมาชิก
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterComponent;