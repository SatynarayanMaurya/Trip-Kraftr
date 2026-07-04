import { useSelector } from 'react-redux'
import React from "react";
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUserHooks } from '../hooks/useUserHooks'
import { useEffect, useState } from 'react'
import { useAuthHooks } from '../hooks/useAuthHooks'
import { Menu, X } from 'lucide-react'

function MainLayout() {
  const userDetails = useSelector((state) => state.user.userDetails)
  const isProduction = useSelector((state) => state.user.isProduction)

  const navigate = useNavigate()
  const { getUserDetails } = useUserHooks()
  const { logout } = useAuthHooks()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const fetchUser = async () => {
    try {
      if (userDetails) return
      await getUserDetails()
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Error in getting the user details"
      )

      if (!isProduction) {
        console.log("========= ERROR DEBUG START =========")
        console.log("Error:", error)
        console.log("Response:", error?.response)
        console.log("========= ERROR DEBUG END =========")
      }

      const status = error?.status
      if (status === 401 || status === 403 || status === 404) {
        await logout()
        navigate("/auth")
      }
    }
  }

  useEffect(() => {
    fetchUser()
  }, [userDetails])

  return (
    <div className="flex h-screen overflow-hidden">

      {/* 🔹 Top Bar (Mobile) */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-white shadow z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={24} />
        </button>

        <div className="w-8 h-8 bg-[#ED5F8D] rounded-full flex items-center justify-center text-sm font-semibold text-white">
          {userDetails?.name?.split(" ")?.[0]?.[0] || "X"}
        </div>
      </div>

      {/* 🔹 Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/40 backdrop-blur-sm z-40
          transition-opacity duration-300
          ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}
          md:hidden
        `}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* 🔹 Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-[#1E3A5F] z-50
          w-[75vw] max-w-70
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-[16vw]
          shadow-lg md:shadow-none
        `}
      >

        {/* ✅ Floating Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition text-white"
        >
          <X size={22} />
        </button>

        {/* ✅ Sidebar Content */}
        <div className="h-full overflow-y-auto md:overflow-hidden pt-6">
          <Sidebar />
        </div>

      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 h-screen overflow-y-auto md:ml-0 pt-15 md:pt-0">
        <Outlet />
      </div>

    </div>
  )
}

export default MainLayout
