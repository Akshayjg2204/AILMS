"use client"

import { useState, useRef, useEffect } from "react"
import Sidebar from "./Sidebar"
import ChatArea from "./ChatArea"
import { sendMessageToAI, getMockAIResponse } from "../../services/aiService"
import "./styles/ChatDashboard.css"

const INITIAL_MESSAGE = {
  text: "Hello! I'm your AI assistant. How can I help you today? You can ask me questions about your courses, get help with assignments, or request study resources.",
  sender: "bot",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

const ChatDashboard = () => {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("chat") // 'chat' or 'search'
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start with sidebar closed
  const messagesEndRef = useRef(null)
  
  // Config for development/production modes
  const USE_MOCK_API = true; // Set to false to use real API when backend is ready

  // Debug logging
  useEffect(() => {
    console.log("Messages state:", messages);
  }, [messages]);

  // Ensure we always have at least the initial message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([INITIAL_MESSAGE]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Force re-render once on component mount to ensure proper display
  useEffect(() => {
    console.log("ChatDashboard mounted");
    // Force a re-render after a short delay
    const timer = setTimeout(() => {
      setMessages(prevMessages => [...prevMessages]);
    }, 100);
    
    // Clean up function
    return () => {
      clearTimeout(timer);
      console.log("ChatDashboard unmounted");
    };
  }, []);

  // Effect to handle sidebar state on window resize
  useEffect(() => {
    const handleResize = () => {
      // Close sidebar automatically on small screens
      if (window.innerWidth <= 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  const handleSend = async () => {
    if (input.trim() === "") return

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")
    setLoading(true)

    try {
      let response;
      
      if (USE_MOCK_API) {
        // Use mock responses for development
        response = await getMockAIResponse(input, mode);
      } else {
        // Use real API for production
        response = await sendMessageToAI(input, mode);
      }

      // Process the response
      let botMessage;
      if (mode === 'search' && response.results) {
        botMessage = {
          text: response.results,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isSearch: true,
        };
      } else {
        botMessage = {
          text: response.response, 
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error details:", error)

      // Display a helpful error message
      const errorMsg = "Sorry, I encountered an issue processing your request. Please try again later.";

      const errorMessage = {
        text: errorMsg,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleMode = (newMode) => {
    setMode(newMode)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled:", !sidebarOpen);
  }

  const clearChat = () => {
    // Reset to initial message instead of empty array
    setMessages([INITIAL_MESSAGE])
  }

  return (
    <div className="dashboard-container" style={{ marginTop: '60px' }}>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        mode={mode}
        toggleMode={toggleMode}
        clearChat={clearChat}
      />
      <ChatArea
        messages={messages}
        input={input}
        setInput={setInput}
        loading={loading}
        mode={mode}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        messagesEndRef={messagesEndRef}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
    </div>
  )
}

export default ChatDashboard

