import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://chat-backend-m9rn.onrender.com/");

const ChatApp = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("")
  const [searchUsername, setSearchUsername] = useState("");
  
  useEffect(() => {
    if (user) {
      socket.emit("join", user.username);
      fetchContacts();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (selectedChat && msg.sender === selectedChat.username) {
        setMessages((prev) => {
          // Only add the message if it isn't already in the list (based on _id)
          return prev.some(m => m._id === msg._id) ? prev : [...prev, msg];
        });
      }
    });
  
    return () => socket.off("receiveMessage");
  }, [selectedChat]);
  
  

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`https://chat-backend-m9rn.onrender.com/api/chat/contacts/${user.username}`);
      setContacts(res.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };
  
  // fetchContacts();

  const searchUser = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await axios.get(`https://chat-backend-m9rn.onrender.com/api/chat/search/${searchQuery}`);
      if (res.data) {
        setContacts((prevContacts) => {
          // Avoid adding duplicate contacts
          return prevContacts.some((c) => c.username === res.data.username)
            ? prevContacts
            : [...prevContacts, res.data];
        });
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error("Error searching user:", err);
    }
  };
  


  const selectChat = async (contact) => {
    setSelectedChat(contact);
    try {
      const res = await axios.get(`https://chat-backend-m9rn.onrender.com/api/chat/messages/${user.username}/${contact.username}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedChat) return;
  
    const chatMessage = {
      sender: user.username,
      receiver: selectedChat.username,
      text: message,
    };
  
    // Emit to server
    socket.emit("sendMessage", chatMessage);
  
    // ✅ Only update state if the sender is the user (avoid duplicate messages)
    setMessages((prev) => [...prev, chatMessage]);
  
    setMessage("");
  
    try {
      await axios.post("https://chat-backend-m9rn.onrender.com/api/chat/private-message", chatMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  return (
    <div className="flex h-screen bg-gradient-to-r from-teal-400 to-indigo-600 text-white overflow-hidden">
      {/* Left Sidebar - Contacts */}
      <div className="w-full sm:w-1/4 md:w-1/5 lg:w-1/6 p-4 border-r bg-white bg-opacity-20 backdrop-blur-md shadow-lg transition-all duration-300 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Chats</h2>
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search User..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 bg-white rounded-lg text-gray-800 focus:outline-none shadow-md transition duration-200"
          />
          <button
            onClick={searchUser}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600 transition duration-200"
          >
            🔍
          </button>
        </div>
  
        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li
              key={contact.username}
              onClick={() => selectChat(contact)}
              className={`p-3 cursor-pointer rounded-lg hover:bg-teal-500 hover:scale-105 transform transition duration-200 ease-in-out ${
                selectedChat?.username === contact.username ? "bg-teal-700" : ""
              }`}
            >
              {contact.username}
            </li>
          ))}
        </ul>
      </div>
  
      {/* Right Chat Area */}
      <div className="w-full sm:w-3/4 md:w-4/5 lg:w-5/6 p-6 flex flex-col bg-white text-gray-900 rounded-lg shadow-lg ml-0 sm:ml-4 relative overflow-y-auto">
        {selectedChat ? (
          <>
            <h2 className="text-2xl font-semibold mb-6">Chat with {selectedChat.username}</h2>
  
            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg shadow-inner">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 my-3 rounded-lg ${
                    msg.sender === user.username
                      ? "bg-teal-200 text-right shadow-md animate__animated animate__fadeIn"
                      : "bg-gray-200 text-left shadow-md animate__animated animate__fadeIn"
                  }`}
                >
                  <strong>{msg.sender === user.username ? "You" : msg.sender}: </strong>
                  {msg.text}
                </div>
              ))}
            </div>
  
            {/* Message Input */}
            <div className="flex items-center space-x-4 mt-4">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                onClick={sendMessage}
                className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 transition duration-200 transform hover:scale-110"
              >
                ➡️
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a chat to start messaging.</p>
        )}
      </div>
    </div>
  );
  
};

export default ChatApp;
