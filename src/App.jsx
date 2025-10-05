import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import CounselorDashboard from "./pages/counselorDashbord.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatBox from "./pages/ChatBox.jsx";
import CounselorProfile from "./pages/CounselorProfile.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import CreateCounselor from "./pages/CreateCounselor.jsx";
import Videocall from "./pages/Videocall.jsx";


function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbox" element={<ChatBox />} />
        <Route path="/profile" element={<CounselorProfile />} />
        <Route path="/create-counselor" element={<CreateCounselor />} />
        <Route path="/videocall/:bookingId" element={<Videocall />} /> 

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Counselor Dashboard */}
        <Route
          path="/counselor-dashboard"
          element={
            <ProtectedRoute user={user} allowedRoles={["counselor"]}>
              <CounselorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
