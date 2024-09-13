import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import AdminPage from "./pages/admin/index";
import EmployeePage from "./pages/employee/index";
import CEOPage from "./pages/ceo/index";
import OtherPage from "./components/other/index";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/register";
import AdminPredictPage from "./pages/admin/predict";
import UserPage from "./pages/admin/userpage";
import Clickpredict from "./components/prediction/Clickpredict";
import NumberOfUserPage from "./pages/admin/NumberOfUserPage";
import BuildingPages from "./pages/admin/building";
import GroupBuildingPage from "./pages/admin/GroupBuildingPage";
import SemesterStatusPage from "./pages/admin/SemesterStatusPage";
import ExamstatusPage from "./pages/admin/ExamstatusPage";
import UnitPage from "./pages/admin/UnitPage";
import AddUnitPages from "./pages/admin/addunitPage";
import ResetPassword from "./components/manages/ResetPassword";
import FoegetpasswordPage from "./pages/forgetpassword";
import CreateNews from "./components/other/CreateNews";
import NewsDetail from "./components/other/NewsDetail";
import NewsCarousel from "./components/other/NewsCarousel";
import NewsPages from "./pages/admin/NewsPage";
import ManageNewsPages from "./pages/admin/ManageNews";
import EmpUnitPage from "./pages/employee/UnitPage";
import EmpSemesterStatusPage from "./pages/employee/SemesterStatusPage";
import EmpGroupBuildingPage from "./pages/employee/GroupBuildingPage";
import EmpBuildingPage from "./pages/employee/dataBuildingPage";
import EmpExamstatusPage from "./pages/employee/ExamstatusPage";
import EmpNumberOfUserPage from "./pages/employee/NumberOfUserPage";
import EmpNewsPages from "./pages/employee/NewsPage";
import EmpManageNewsPages from "./pages/employee/ManageNews";
import EmpAddUnitPages from "./pages/employee/addunitPage";
import EmpPredictPage from "./pages/employee/predict";
import CeoPage from "./pages/ceo/index";
import CeoPredictPage from "./pages/ceo/predict";
import OtherPage1 from "./pages/other";
import OtherPredictPage from "./pages/other/predict";
import KnowHowPage from "./pages/KnowHowPage";
function AppRouter() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/knowhow" element={<KnowHowPage />} />

          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/forget-password" element={<FoegetpasswordPage />} />
          <Route path="/p" element={<CreateNews />} />
          <Route path="/n" element={<NewsCarousel />} />
          <Route path="/news/:id" element={<NewsDetail />} />
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
            path="/admin/clickpredict"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <Clickpredict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/datauser"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <NumberOfUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/databuilding"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <BuildingPages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/databuilding-group"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <GroupBuildingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dataSemester"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <SemesterStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dataExam"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <ExamstatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dataUnit"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <UnitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dataAddUnit"
            element={
              <ProtectedRoute allowedStatus={[0,1]}>
                <AddUnitPages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/createnews"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <NewsPages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/viewnews"
            element={
              <ProtectedRoute allowedStatus={[0]}>
                <ManageNewsPages />
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
            path="/employee/predict"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpPredictPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/clickpredict"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <Clickpredict />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/datauser"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpNumberOfUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/databuilding"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpBuildingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/databuilding-group"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpGroupBuildingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dataSemester"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpSemesterStatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dataExam"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpExamstatusPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dataUnit"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpUnitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/dataAddUnit"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpAddUnitPages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/createnews"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpNewsPages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/viewnews"
            element={
              <ProtectedRoute allowedStatus={[1]}>
                <EmpManageNewsPages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ceo"
            element={
              <ProtectedRoute allowedStatus={[2]}>
                <CeoPage />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/ceo/predict"
            element={
              <ProtectedRoute allowedStatus={[2]}>
                <CeoPredictPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/other"
            element={
              <ProtectedRoute allowedStatus={[3]}>
                <OtherPage1 />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/other/predict"
            element={
              <ProtectedRoute allowedStatus={[3]}>
                <OtherPredictPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRouter;
