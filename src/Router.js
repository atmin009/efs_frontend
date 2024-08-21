import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import AdminPage from "./pages/admin/index";
import EmployeePage from "./pages/employee/index";
import CEOPage from "./pages/ceo/index";
import OtherPage from "./pages/other/index";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/register";
import AdminPredictPage from "./pages/admin/predict";
import UserPage from "./pages/admin/userpage";


function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/predict"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <AdminPredictPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <UserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmployeePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ceo"
            element={
              <ProtectedRoute allowedStatus={[2]}>
                <CEOPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/other"
            element={
              <ProtectedRoute allowedStatus={[3]}>
                <OtherPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;
