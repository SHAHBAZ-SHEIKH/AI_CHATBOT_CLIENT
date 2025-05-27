import React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast, Toaster } from "sonner"
import { api } from "../../utils/url"
import { useDispatch, useSelector } from "react-redux"
import { loginFailure, loginStart, loginSuccess } from '../../redux/slices/user'
import Loader from "../../Components/Loader/Loader"
import { setChatHistory } from "../../redux/slices/chat"
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"

const Login = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (user?.user) {
      navigate("/")
    }
  }, [user?.user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(loginStart())
      const res = await api.post("api/auth/login", formData)

      if (res?.data?.token) {
        dispatch(loginSuccess(res?.data?.data))
        localStorage.setItem("token", JSON.stringify(res?.data?.token))

        const chatRes = await api.get(`/api/chat/user-history`, {
          headers: {
            Authorization: `Bearer ${res?.data?.token}`,
          },
        })

        dispatch(setChatHistory(chatRes?.data?.data))
        
        setTimeout(() => {
          toast.success(res?.data?.message)

          navigate("/")
        }, 2000)
      } else {
        dispatch(loginFailure(res?.data?.message))
        toast.error(res?.data?.message)
      }
    } catch (error) {
      dispatch(loginFailure(error?.response?.data?.message))
      toast.error(error?.response?.data?.message || "Login failed")
    }
  }

  return (
    <>
      {user?.loading && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
        {/* Left Side - Hero */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute bottom-40 right-10 w-24 h-24 bg-white rounded-full"></div>
          </div>

          <div className="max-w-md text-white z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-6">Welcome Back to AI Content Studio</h1>
            <p className="text-xl mb-8 opacity-90">
              Continue creating amazing content with the power of artificial intelligence
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-800">✓</span>
                </div>
                <span>Generate high-quality content in seconds</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-800">✓</span>
                </div>
                <span>Access to advanced AI models</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-800">✓</span>
                </div>
                <span>Save and organize your conversations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg lg:hidden">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
              <p className="text-gray-600">Welcome back! Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={user?.loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
              >
                <span>{user?.loading ? "Signing In..." : "Sign In"}</span>
                {!user?.loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              </button>

              {/* Signup Link */}
              <p className="text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Create Account
                </Link>
              </p>
            </form>

            {/* Demo Account */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Demo Account:</span> demo@example.com / password123
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default Login
