"use client"

import { useState } from "react"
import { Copy, ThumbsUp, ThumbsDown, RefreshCw, Share } from "lucide-react"
import { toast } from "sonner"

const MessageBubble = ({ message, isUser, isGenerating }) => {
  const [showActions, setShowActions] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleLike = () => {
    setLiked(!liked)
    if (disliked) setDisliked(false)
    toast.success(liked ? "Removed like" : "Message liked!")
  }

  const handleDislike = () => {
    setDisliked(!disliked)
    if (liked) setLiked(false)
    toast.success(disliked ? "Removed dislike" : "Feedback noted")
  }

  const handleRegenerate = () => {
    toast.info("Regenerating response...")
    // Add regenerate functionality here
  }

  const handleShare = () => {
    toast.success("Share link copied!")
    // Add share functionality here
  }

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-start space-x-3 max-w-[80%]">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl rounded-tr-md px-6 py-4 shadow-lg">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-3 max-w-[80%]">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">AI</span>
        </div>
        <div
          className="bg-white rounded-2xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-100 group"
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {isGenerating ? (
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-sm text-gray-500">AI is thinking...</span>
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{message}</p>

              {/* Message Actions */}
              <div
                className={`flex items-center justify-between mt-4 pt-3 border-t border-gray-100 transition-opacity duration-200 ${
                  showActions ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(message)}
                    className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy message"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                      liked ? "text-green-600 bg-green-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    title="Like this response"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span>Good</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-lg transition-colors ${
                      disliked ? "text-red-600 bg-red-50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    title="Dislike this response"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    <span>Bad</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Regenerate response"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Regenerate</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Share message"
                  >
                    <Share className="h-3 w-3" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
