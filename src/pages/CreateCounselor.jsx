import { useState } from "react";
import api from "../utils/api"; // axios instance
import { useNavigate } from "react-router-dom";

const CreateCounselor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    specialty: "",
    description: "",
    experience: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/counselors", form); // POST API to save in DB
      alert("Counselor created successfully!");
      navigate("/counselor-dashboard"); // redirect to homepage
    } catch (error) {
      console.error("Error creating counselor:", error);
      alert("Failed to create counselor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Counselor
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="specialty"
            placeholder="Specialty"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <input
            type="number"
            name="experience"
            placeholder="Experience (in years)"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            name="expectedFees"
            placeholder="Expected Fees (INR)"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleSubmit}
          >
            Create Counselor
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCounselor;
