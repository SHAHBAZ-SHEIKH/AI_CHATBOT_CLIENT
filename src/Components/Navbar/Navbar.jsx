"use client"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../../redux/slices/user"
import { useNavigate } from "react-router-dom"
import { Menu, User, LogOut, Settings, ChevronDown, Sparkles, Bell, HelpCircle } from 'lucide-react'

const Navbar = ({ onHamburgerClick, isSidebarOpen }) => {
  const user = useSelector((state) => state.user)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    dispatch(logoutUser())
    navigate("/login")
    setIsDropdownOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onHamburgerClick}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI Content Generator
              </h1>
            </div>
          </div>

          {/* Center Section - Chat Title */}
          <div className="hidden md:flex items-center">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Current Chat</p>
              <p className="text-xs text-gray-500">Ready to help you create amazing content</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>

            {/* Help */}
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src={user?.user?.img || "/api/placeholder/40/40"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700">{user?.user?.name?.split(" ")[0]}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user?.user?.img || "/api/placeholder/48/48"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user?.user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      View Profile
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="h-4 w-4 mr-3 text-gray-400" />
                      Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                      Help & Support
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
