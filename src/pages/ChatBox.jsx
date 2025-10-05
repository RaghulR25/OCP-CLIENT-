import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const socket = io("http://localhost:3000"); 

const ChatBox = () => {
  const { user } = useAuth(); 
  const location = useLocation();
  const { receiver, booking } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

 
  useEffect(() => {
    
  }, [user, receiver, booking]);

 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!booking?._id) return;
        const { data } = await api.get(`/chat/${booking._id}`);
        setMessages(data.messages.length ? data.messages : []);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [booking]);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (
        (message.senderId === receiver?._id && message.receiverId === user?._id) ||
        (message.senderId === user?._id && message.receiverId === receiver?._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off("receive_message");
  }, [receiver, user]);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!user?._id || !receiver?._id) {
      console.error("❌ Missing user or receiver info:", { user, receiver });
      alert("User or receiver info is missing. Cannot send message.");
      return;
    }

    const message = {
      text: input,
      senderId: user._id, 
      senderName: user.name,
      receiverId: receiver._id,
      receiverName: receiver.name,
      bookingId: booking?._id || null,
    };

    // Update UI immediately
    setMessages((prev) => [...prev, message]);
    setInput("");

    try {
      await api.post("/chat", message); // save in DB
      socket.emit("send_message", message); // real-time
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Chat with {receiver?.name || "Unknown"}
      </h1>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded bg-[#ECE5DD]">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-2">No messages yet.</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex my-2 ${
              msg.senderId === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                msg.senderId === user?._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <span className="block text-sm font-semibold">
                {msg.senderId === user?._id ? "You" : msg.senderName}
              </span>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
