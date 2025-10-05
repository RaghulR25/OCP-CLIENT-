import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";


const CounselorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [counselor] = useState(location.state?.counselor);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booking, setBooking] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!user) return <p>Please login first to book a session.</p>;

  // Stripe Payment
  const handlePay = async () => {
    if (!selectedDate || !selectedTime)
      return alert("Please select date & time");

    try {
      const { data } = await api.post("/payment/create-checkout-session", {
        amount: counselor.expectedFees,
        counselorId: counselor._id,
        userId: user._id,
        date: selectedDate,
        time: selectedTime,
      });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed");
    }
  };

  // Booking session after payment (can be done on /payment-success page)
  const handleBookSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.post(
        "/bookings/",
        {
          user: user._id,
          counselor: counselor._id,
          date: selectedDate,
          time: selectedTime,
          paymentDone: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking(data);
      setPaymentDone(true);
      alert(`✅ Session booked for ${selectedDate} at ${selectedTime}`);
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  // Chat / Video / Email handlers
  const handleVideoCall = () => {
    if (!booking) return alert("Please book a session first.");
    navigate(`/videocall/${booking._id}`, { state: { 
     booking: { ...booking, counselor, user },
    } }); 
  };

  const handleChat = () => {
    if (!booking) return alert("Please book a session first.");
    navigate("/chatbox", { state: {
      bookingId: booking._id,
      counselorId: counselor._id,
      counselorName: counselor.name,
      userId: user._id,
      userName: user.name,
    } }); 
  };

  const handleEmail = () => {
    if (!booking) return alert("Please book a session first.");
    const subject = encodeURIComponent("Counseling Session");
    const body = encodeURIComponent(
      `Hello ${counselor.name},\n\nI would like to discuss my counseling session scheduled on ${booking.date} at ${booking.time}.\n\nThanks,\n${user.name}`
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${counselor.email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{counselor?.name}</h1>
      <p className="mb-2 text-gray-700">Specialty: {counselor?.specialty}</p>
      <p className="mb-2 text-gray-600">{counselor?.description}</p>
      <p className="mb-6 font-semibold text-gray-800">Fee: ₹{counselor?.expectedFees}</p>

      <h2 className="text-xl font-bold mb-3 text-gray-800">Book a Session</h2>
      <div className="flex flex-col gap-3 mb-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-3 rounded-lg"
        />
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="border p-3 rounded-lg"
        />
        <button
          onClick={handlePay}
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Pay ₹{counselor?.expectedFees}
        </button>
        <button
          onClick={handleBookSession}
          disabled={!paymentDone}
          className={`py-3 rounded-lg ${paymentDone ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
        >
          Book Session
        </button>
      </div>

      {booking && (
        <div className="mt-6">
          <p className="text-green-600 font-semibold mb-3">✅ Session booked!</p>
          <div className="flex gap-3">
            <button onClick={handleVideoCall} className="bg-purple-600 text-white py-3 px-5 rounded-lg hover:bg-purple-700">📹 Join Video Call</button>
            <button onClick={handleChat} className="bg-green-600 text-white py-3 px-5 rounded-lg hover:bg-green-700">💬 Chat</button>
            <button onClick={handleEmail} className="bg-red-600 text-white py-3 px-5 rounded-lg hover:bg-red-700">📧 Email</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselorProfile;