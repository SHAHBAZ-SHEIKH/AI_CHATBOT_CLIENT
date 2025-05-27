"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Mic, Square } from "lucide-react"

const ChatInput = ({ onSend, isGenerating, disabled }) => {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px"
    }
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
    adjustTextareaHeight()
  }

  const handleSend = () => {
    if (input.trim() && !isGenerating && !disabled) {
      onSend(input.trim())
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Add voice recording functionality here
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Input Container */}
          <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-200 shadow-sm">
            {/* Attachment Button */}
            <button
              className="absolute left-3 bottom-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
              className="w-full pl-12 pr-24 py-4 bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 text-base leading-relaxed"
              rows="1"
              style={{ minHeight: "60px", maxHeight: "150px" }}
              disabled={disabled || isGenerating}
            />

            {/* Right Side Buttons */}
            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              {/* Voice Recording Button */}
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isRecording
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
                title={isRecording ? "Stop recording" : "Start voice recording"}
              >
                {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isGenerating || disabled}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Character Count & Tips */}
          <div className="flex items-center justify-between mt-3 px-1">
            <div className="flex items-center space-x-4">
              <p className="text-xs text-gray-400">{input.length > 0 && `${input.length} characters`}</p>
              {input.length > 1000 && (
                <p className="text-xs text-amber-500">Consider breaking into smaller prompts for better results</p>
              )}
              {isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500">Recording...</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center justify-center mt-4">
          <p className="text-xs text-gray-400">AI can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
