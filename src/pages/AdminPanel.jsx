import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const { user, logout } = useAuth(); 

  useEffect(() => {
    
    api.get("/auth/users")
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err));

    
    api.get("/auth/counselors")
      .then(res => setCounselors(res.data.counselors))
      .catch(err => console.error(err));
  }, []);

  const handleLogoutUser = async (id) => {
    try {
      await api.post(`/auth/logout/${id}`);
      alert("User logged out successfully");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to log out user");
    }
  };

  const handleLogoutCounselor = async (id) => {
    try {
      await api.post(`/auth/logout/${id}`);
      alert("Counselor logged out successfully");
      setCounselors(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to log out counselor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Panel</h1>

    
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Users ({users.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <p className="font-semibold text-lg">{u.name}</p>
                <p className="text-gray-500">{u.email}</p>
                <p className="text-sm text-gray-400 capitalize">Role: {u.role}</p>
              </div>
              <button
                onClick={() => handleLogoutUser(u._id)}
                className="mt-4 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition"
              >
                Logout User
              </button>
            </div>
          ))}
        </div>
      </div>

     
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Counselors ({counselors.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counselors.map(c => (
            <div key={c._id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
              <div>
                <p className="font-semibold text-lg">{c.name}</p>
                <p className="text-gray-500">{c.email}</p>
                <p className="text-sm text-gray-400 capitalize">Specialty: {c.specialty}</p>
                <p className="text-sm text-gray-400">Experience: {c.experience} years</p>
                <p className="text-sm text-gray-400">Fees: ${c.expectedFees}</p>
              </div>
              <button
                onClick={() => handleLogoutCounselor(c._id)}
                className="mt-4 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition"
              >
                Logout Counselor
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
