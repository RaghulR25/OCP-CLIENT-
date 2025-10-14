import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const socket = io(import.meta.env.VITE_PORT || "http://localhost:3000");

const ChatBox = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { receiver, booking } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages from DB
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiver?._id) return;
      try {
        const { data } = await api.get(`/chat/${receiver._id}`);
        setMessages(data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [receiver]);

  // Socket listener
  useEffect(() => {
    socket.on("receive_message", (message) => {
      if (
        message.senderId === receiver?._id ||
        message.receiverId === receiver?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off("receive_message");
  }, [receiver]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !receiver?._id) return;

    const messagePayload = {
      text: input,
      receiverId: receiver._id,
      bookingId: booking?._id,
    };

    setMessages((prev) => [
      ...prev,
      { ...messagePayload, senderId: user._id, senderName: user.name },
    ]);
    setInput("");

    try {
      const { data } = await api.post("/chat", messagePayload);
      socket.emit("send_message", data); // Emit to socket server
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Chat with {receiver?.name || "Unknown"}
      </h1>

      <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded bg-[#ECE5DD]">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-2">No messages yet.</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex my-2 ${
              msg.senderId === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                msg.senderId === user._id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-300 text-black rounded-bl-none"
              }`}
            >
              <span className="block text-sm font-semibold">
                {msg.senderId === user._id ? "You" : msg.senderName}
              </span>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
