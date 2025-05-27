"use client"

import Sidebar from "../../Components/Sidebar/Sidebar"
import MessageBubble from "../../Components/MessageBubble/MessageBubble"
import ChatInput from "../../Components/ChatInput/ChatInput"
import { useState, useEffect, useRef } from "react"
import Navbar from "../../Components/Navbar/Navbar"
import { api } from "../../utils/url"
import { useDispatch, useSelector } from "react-redux"
import { setChatId, updateChatHistory, updateChatHistoryMessages } from "../../redux/slices/chat"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isInitialView, setIsInitialView] = useState(true)
  const messagesEndRef = useRef(null)

  const user = useSelector((state) => state.user.user)
  const chatId = useSelector((state) => state?.chat?.chatId)
  const chatHistory = useSelector((state) => state?.chat?.chatHistory)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      navigate("/signup")
    }
  }, [user])

  useEffect(() => {
    if (chatId) {
      const chat = chatHistory?.find((chat) => chat._id === chatId)
      setMessages(chat?.messages || [])
      setIsInitialView(false)
    } else {
      setIsInitialView(true)
      setMessages([])
    }
  }, [chatId, chatHistory])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  const handleSendMessage = async (userMessage) => {
    setIsInitialView(false)

    try {
      const newMessages = [...messages, { question: userMessage, answer: "Generating..." }]
      setMessages(newMessages)
      setIsGenerating(true)

      const response = await api.post("/generate", {
        prompt: userMessage,
      })

      setIsGenerating(false)

      if (chatId) {
        const updatedMessages = [...messages, { question: userMessage, answer: response?.data?.response }]
        setMessages(updatedMessages)

        dispatch(
          updateChatHistoryMessages({
            chatId: chatId,
            messages: updatedMessages,
          }),
        )

        const token = JSON.parse(localStorage.getItem("token"))
        await api.put(
          `/api/chat/update/${chatId}`,
          {
            question: userMessage,
            answer: response?.data?.response,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
      } else {
        const token = JSON.parse(localStorage.getItem("token"))
        const res = await api.post(
          "/api/chat/save",
          {
            question: userMessage,
            answer: response?.data?.response,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        dispatch(setChatId(res?.data?.data?._id))
        dispatch(updateChatHistory(res?.data?.data))
      }
    } catch (error) {
      console.error("Error:", error.message)
      setIsGenerating(false)
      toast.error("Failed to generate response. Please try again.")
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1].answer = "Sorry, there was an error generating the response. Please try again."
        return updated
      })
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onClose={handleSidebarClose} />

      {/* Main Content Area - No margin needed, flex will handle it */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onHamburgerClick={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {isInitialView ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="max-w-2xl w-full text-center">
                {/* Simple Welcome */}
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-4">
                    AI Content Generator
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">What would you like me to help you with today?</p>
                </div>

                {/* Quick Examples */}
                <div className="text-left max-w-md mx-auto space-y-3 mb-8">
                  <p className="text-sm text-gray-500 font-medium">Try asking me to:</p>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      "Write a blog post about artificial intelligence"
                    </div>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      "Create social media content for my business"
                    </div>
                    <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      "Help me write an email to my team"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-4 space-y-6">
                {messages?.map((message, index) => (
                  <div key={index}>
                    <MessageBubble message={message?.question} isUser={true} />
                    <MessageBubble
                      message={message?.answer}
                      isUser={false}
                      isGenerating={message?.answer === "Generating..."}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Chat Input */}
          <ChatInput onSend={handleSendMessage} isGenerating={isGenerating} disabled={false} />
        </div>
      </div>
    </div>
  )
}

export default Chat
