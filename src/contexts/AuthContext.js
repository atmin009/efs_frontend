import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // กำหนดค่าเริ่มต้นจาก localStorage หรือค่าเริ่มต้นปกติ
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : { isLoggedIn: false, user: null };
  });

  // ใช้ useEffect เพื่อบันทึก auth ลงใน localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
