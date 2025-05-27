

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import fileToBase64 from "../../utils/helper"
import { api } from "../../utils/url"
import { toast, Toaster } from "sonner"
import Loader from "../../Components/Loader/Loader"
import { useSelector } from "react-redux"
import { Camera, User, Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle } from "lucide-react"

const Signup = () => {
  const user = useSelector((state) => state.user.user)
  const [loader, setLoader] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    img: null,
  })
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  const handleChange = async (e) => {
    const { name, value, files } = e.target
    if (files && name === "img") {
      const file = files[0]
      try {
        const base64Image = await fileToBase64(file)
        setFormData({
          ...formData,
          [name]: base64Image,
        })
        setPreviewUrl(base64Image)
      } catch (error) {
        console.error("Error converting file to base64:", error)
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoader(true)

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields")
      setLoader(false)
      return
    }

    try {
      const res = await api.post("api/auth/signup", formData)
      toast.success(res?.data?.message)
      setLoader(false)
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Something went wrong")
      setLoader(false)
    }
  }

  const features = [
    "Unlimited AI content generation",
    "Advanced writing assistance",
    "Multiple content formats",
    "24/7 customer support",
  ]

  return (
    <>
      {loader && <Loader />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
              <p className="text-gray-600">Join thousands of creators using AI to enhance their content</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-2xl border-4 border-gray-200 overflow-hidden cursor-pointer hover:border-blue-300 transition-all duration-200 group-hover:shadow-lg"
                    onClick={() => document.getElementById("img").click()}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <input type="file" id="img" name="img" accept="image/*" onChange={handleChange} className="hidden" />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loader}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loader ? "Creating Account..." : "Create Account"}
              </button>

              {/* Login Link */}
              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side - Features */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 p-8 items-center justify-center">
          <div className="max-w-md text-white">
            <h2 className="text-3xl font-bold mb-6">Why Choose AI Content Studio?</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0" />
                  <span className="text-lg">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
              <p className="text-lg italic">
                "This AI tool has revolutionized how I create content. It's like having a writing assistant that never
                sleeps!"
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div>
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm opacity-80">Content Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
}

export default Signup
