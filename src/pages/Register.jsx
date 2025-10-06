import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Button from "../components/Button";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/register", form);
      login({ name: form.name, email: form.email, role: form.role }, data.token);

      if (form.role === "admin") navigate("/admin");
      else if (form.role === "counselor") navigate("/create-counselor");
      else navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h1>
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
        <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 mb-4 rounded">
          <option value="user">User</option>
          <option value="counselor">Counselor</option>
          <option value="admin">Admin</option>
        </select>
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
};

export default Register;
