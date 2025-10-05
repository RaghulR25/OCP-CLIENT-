import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Button from "../components/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      login({ email: form.email, role: data.role }, data.token);

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "counselor") navigate("/counselor-dashboard");
      else navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h1>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full border p-2 mb-4 rounded" />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </div>
  );
};

export default Login;
