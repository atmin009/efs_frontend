import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedStatus }) => {
  // ดึงค่า AuthContext
  const authContext = useContext(AuthContext);

  // ตรวจสอบว่า AuthContext ได้ถูกสร้างขึ้นหรือไม่
  if (!authContext) {
    console.error('AuthContext is undefined');
    return <Navigate to="/" />;  // เปลี่ยนเส้นทางไปที่หน้าแรก
  }

  const { auth } = authContext;
  console.log('Auth value:', auth);
  // ตรวจสอบสถานะการล็อกอิน
  if (!auth?.isLoggedIn) {
    return <Navigate to="/" />;  // ถ้าไม่ได้ล็อกอิน เปลี่ยนเส้นทางไปที่หน้าแรก
  }

  // ตรวจสอบว่าสถานะของผู้ใช้ตรงกับสถานะที่อนุญาตหรือไม่
  if (!allowedStatus.includes(auth.user?.status)) {
    return <Navigate to="/" />;  // ถ้าสถานะไม่ตรง เปลี่ยนเส้นทางไปที่หน้าแรก
  }

  // ถ้าทุกอย่างถูกต้อง ให้แสดง component ลูก
  return children;
};

export default ProtectedRoute;
