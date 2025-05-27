"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setChatId } from "../../redux/slices/chat"
import { Search, MessageSquare, Plus, X, Sparkles, Clock, Trash2, Edit3 } from "lucide-react"

const Sidebar = ({ isOpen, setIsOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const chatHistory = useSelector((state) => state?.chat?.chatHistory)
  const currentChatId = useSelector((state) => state?.chat?.chatId)
  const dispatch = useDispatch()
  const [filteredChats, setFilteredChats] = useState(chatHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredChat, setHoveredChat] = useState(null)

  useEffect(() => {
    setFilteredChats(chatHistory)
  }, [chatHistory])

  const handleChatClick = (chatId) => {
    dispatch(setChatId(chatId))
    if (isMobile) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024
      setIsMobile(mobile)
      if (!mobile) {
        setIsOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [setIsOpen])

  const handleSearch = (value) => {
    setSearchTerm(value)
    const searchTerm = value.toLowerCase()
    const filteredChats = chatHistory.filter((chat) => chat?.messages[0]?.question?.toLowerCase().includes(searchTerm))
    setFilteredChats(filteredChats)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    // Add delete functionality here
    console.log("Delete chat:", chatId)
  }

  const handleRenameChat = (e, chatId) => {
    e.stopPropagation()
    // Add rename functionality here
    console.log("Rename chat:", chatId)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar - Fixed positioning with proper width */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200/50 z-50 transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative lg:z-auto
          flex flex-col shadow-lg lg:shadow-none
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Conversations</h2>
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => handleChatClick(null)}
            className="flex items-center justify-center w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-medium">New Conversation</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <Clock className="h-3 w-3" />
              <span>Recent Chats</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="space-y-1 p-2">
              {filteredChats?.length > 0 ? (
                filteredChats
                  .slice()
                  .reverse()
                  .map((chat) => (
                    <div
                      key={chat._id}
                      className={`
                        group relative p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50
                        ${
                          currentChatId === chat._id ? "bg-blue-50 border border-blue-200 shadow-sm" : "hover:shadow-sm"
                        }
                      `}
                      onClick={() => handleChatClick(chat._id)}
                      onMouseEnter={() => setHoveredChat(chat._id)}
                      onMouseLeave={() => setHoveredChat(null)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`
                          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                          ${currentChatId === chat._id ? "bg-blue-100" : "bg-gray-100 group-hover:bg-gray-200"}
                        `}
                        >
                          <MessageSquare
                            className={`h-4 w-4 ${currentChatId === chat._id ? "text-blue-600" : "text-gray-500"}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              currentChatId === chat._id ? "text-blue-900" : "text-gray-900"
                            }`}
                          >
                            {chat?.messages[0]?.question?.slice(0, 35)}
                            {chat?.messages[0]?.question?.length > 35 && "..."}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{formatTime(chat.createdAt || Date.now())}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <MessageSquare className="h-3 w-3" />
                              <span>{chat?.messages?.length || 0} messages</span>
                            </div>
                          </div>
                        </div>

                        {/* Chat Actions */}
                        {(hoveredChat === chat._id || currentChatId === chat._id) && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => handleRenameChat(e, chat._id)}
                              className="p-1 rounded-md hover:bg-blue-100 transition-all duration-200"
                              title="Rename chat"
                            >
                              <Edit3 className="h-3 w-3 text-blue-500" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat._id)}
                              className="p-1 rounded-md hover:bg-red-100 transition-all duration-200"
                              title="Delete chat"
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start a new chat to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-400">Powered by AI • Made with Shahbaz ❤️</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <span className="text-xs text-gray-500">{filteredChats?.length || 0} conversations</span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs text-gray-500">
                {chatHistory?.reduce((total, chat) => total + (chat?.messages?.length || 0), 0)} messages
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar


