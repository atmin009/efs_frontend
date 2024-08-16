import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // เปลี่ยน Switch เป็น Routes และ Route
import HomePage from './pages/index';
import OtherPage from './pages/other';
import AdminPredictPage from './pages/admin/predict';
import RegisterPage from './pages/register';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/other" element={<OtherPage />} />
        <Route path="/admin/predict" element={<AdminPredictPage />} />

      </Routes>
    </Router>
  );
}

export default AppRouter;
