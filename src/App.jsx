"use client"

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Chat from "./Pages/Chat/Chat"
import Signup from "./Pages/Signup/Signup"
import Login from "./Pages/Login/Login"
import { useDispatch, useSelector } from "react-redux"
import { api } from "./utils/url"
import { useEffect } from "react"
import { loginSuccess } from "./redux/slices/user"
import { setChatHistory } from "./redux/slices/chat"
import Loader from "./Components/Loader/Loader"
import { Toaster } from "sonner"

function App() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  const loading = useSelector((state) => state.user.loading)

  useEffect(() => {
    const checkUser = async () => {
      const token = JSON.parse(localStorage.getItem("token"))
      if (token) {
        try {
          const res = await api.get("api/auth/isuserloggedin", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          dispatch(loginSuccess(res?.data?.data))

          // fetch the chat history
          const chatRes = await api.get(`/api/chat/user-history`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          dispatch(setChatHistory(chatRes?.data?.data))
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
        }
      }
    }
    checkUser()
  }, [dispatch])

  return (
    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Navigate to="/signup" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      />
    </>
  )
}

export default App
