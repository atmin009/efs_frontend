import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from '../../api';
import { AuthContext } from '../../contexts/AuthContext';

const SettingsModal = ({ show, handleClose, selectedUser, setSelectedUser }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState(''); // First new password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm new password input
  const [oldPassword, setOldPassword] = useState(''); // For old password input
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState(false); // To track password mismatch
  
  // Math verification
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [mathAnswer, setMathAnswer] = useState('');

  useEffect(() => {
    if (selectedUser && selectedUser.user_id) {
      fetchUserData(selectedUser.user_id);
      generateMathQuestion(); // Generate the random numbers
    }
  }, [selectedUser]);

  // Generate random numbers for the math question
  const generateMathQuestion = () => {
    const randomNum1 = Math.floor(Math.random() * 10) + 1;
    const randomNum2 = Math.floor(Math.random() * 10) + 1;
    setNum1(randomNum1);
    setNum2(randomNum2);
  };

  // Fetch user data from API
  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${BASE_URL}/members/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData({
          ...data,
          user_id: userId,
        });
      } else {
        toast.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone number validation
  const formatPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedPhone = cleanPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return formattedPhone;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, ''); // Only allow numbers
    if (input.length > 10) return; // Limit to 10 digits
    const formattedPhone = formatPhoneNumber(input);
    setUserData({ ...userData, phone: formattedPhone });
  };

  const saveChanges = async () => {
    // Validate email
    if (!validateEmail(userData.email)) {
      setEmailError("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }

    // Remove hyphens from the phone number before sending it to the server
    const cleanPhone = userData.phone.replace(/\D/g, '');

    // Check if the two new passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError(true);
      toast.error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    // Check math answer
    if (parseInt(mathAnswer) !== num1 + num2) {
      toast.error("ผลบวกไม่ถูกต้อง");
      return;
    }

    try {
      const updatedUser = {
        id: userData.user_id,
        username: userData.username,
        fname: userData.fname,
        lname: userData.lname,
        email: userData.email,
        phone: cleanPhone, // Send without hyphens
        status: userData.status,
        name: `${userData.fname} ${userData.lname}`,
        ...(newPassword && { password: newPassword }), // Update password only if new one is provided
      };

      const response = await fetch(`${BASE_URL}/members/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedData = await response.json();
        toast.success('บันทึกข้อมูลสำเร็จ');

        // Update localStorage and AuthContext
        const updatedAuthData = {
          isLoggedIn: true,
          user: {
            ...auth.user,
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            email: updatedUser.email,
            phone: updatedUser.phone,
            name: updatedUser.name,
          },
        };

        // Update localStorage immediately
        localStorage.setItem('auth', JSON.stringify(updatedAuthData));

        // Update AuthContext immediately
        setAuth(updatedAuthData);

        handleClose(); // Close the modal after successful save
      } else {
        const errorData = await response.json();
        toast.error('ไม่สามารถอัปเดตข้อมูลได้: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily:'Anuphan' }}>แก้ไขข้อมูลส่วนตัว</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontFamily:'Anuphan' }}>
          {userData && (
            <Form>
              <Form.Group>
                <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.username}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>ชื่อจริง</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.fname || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, fname: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>นามสกุล</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.lname || ''}
                  onChange={(e) =>
                    setUserData({ ...userData, lname: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  type="email"
                  value={userData.email || ''}
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                    setEmailError('');
                  }}
                />
                {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>เบอร์โทร</Form.Label>
                <Form.Control
                  type="text"
                  value={userData.phone || ''}
                  onChange={handlePhoneChange}
                />
                {phoneError && <span style={{ color: 'red' }}>{phoneError}</span>}
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>รหัสผ่านใหม่</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(false); // Reset error when user changes input
                  }}
                />
              </Form.Group>
              <Form.Group className="mt-2">
                <Form.Label>ยืนยันรหัสผ่านใหม่</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError(false); // Reset error when user changes input
                  }}
                  className={passwordError ? "is-invalid" : ""}
                />
                {passwordError && (
                  <div className="invalid-feedback">
                    รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน
                  </div>
                )}
              </Form.Group>
              
              {/* Math verification */}
              <Form.Group className="mt-3">
                <Form.Label>กรุณากรอกผลลัพธ์ของ</Form.Label>
                <div className="d-flex align-items-center">
                  <Badge pill bg="primary" className="mx-1">{num1}</Badge>
                  <span className="mx-1">+</span>
                  <Badge pill bg="primary" className="mx-1">{num2}</Badge>
                  <span className="mx-1">=</span>
                  <Form.Control
                    type="text"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="กรอกผลลัพธ์"
                    style={{ width: '100px', marginLeft: '10px' }}
                  />
                </div>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ปิด
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast notification container */}
      <ToastContainer />
    </>
  );
};

export default SettingsModal;
