import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Building2,
  Settings,
  Users,
  FileText,
  Shield,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import hotel_icon from "../../assets/sidebar/hotel_icon_sidebar.png";
import vehicle_icon from "../../assets/sidebar/vehicle_icon_sidebar.png";
import place_icon from "../../assets/sidebar/place_icon_sidebar.png";
import activities_icon from "../../assets/sidebar/activities_icon_sidebar.png";
import dmc_icon from "../../assets/sidebar/dmc_icon_sidebar.png";
import { useSelector } from "react-redux";

function Sidebar() {
  const [openSupplier, setOpenSupplier] = useState(true);
  const userDetails = useSelector((state)=>state.user.userDetails)
  const [activeTab, setActiveTab] = useState("Hotels");

  const [openAdmin, setOpenAdmin] = useState(false)

  const supplierTabs = [
    { name: "Hotels", icon: hotel_icon, path: "/hotels" },
    { name: "Vehicles", icon: vehicle_icon, path: "/vehicles" },
    { name: "Places", icon: place_icon, path: "/places" },
    { name: "Activities", icon: activities_icon, path: "/activities" },
  ];
  const adminTabs = [
    { name: "Organizations", icon: activities_icon, path: "/organizations", roles:['super_admin'] },
    { name: "Plans", icon: dmc_icon, path: "/plans" , roles:['super_admin'] },
    { name: "Regions", icon: hotel_icon, path: "/regions" , roles:['org_admin'] },
    { name: "Sub Regions", icon: vehicle_icon, path: "/sub-regions", roles:["org_admin"]  },
  ];
  const filteredTabs = adminTabs.filter(tab =>
    tab.roles.includes(userDetails?.role)
  );

  const staticMenuTabs = [
    "Customise Trips",
    "Manage Group Trips",
    "Manage B2B Trips",
    "My Sample Trips",
  ]

  const supplierTabClicked = ()=>{
    setOpenAdmin(false);
    setOpenSupplier(!openSupplier)
  }
  const adminTabClicked = ()=>{
    setOpenSupplier(false)
    setOpenAdmin(!openAdmin);
  }

  return (
    <div className="h-screen hide_scrollbar overflow-scroll bg-[#1E3A5F] text-white flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="px-6 py-5 text-2xl font-semibold">Mezenga</div>

        {/* Profile */}
        <div className="px-6 mb-6">
          <div className="flex items-center gap-3 bg-[#244A78] rounded-full px-3 py-2 w-fit">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm font-semibold">
              {userDetails?.name?.split(" ")?.[0]?.[0]||"X"}
            </div>
            <span className="font-medium">{userDetails?.name?.split(" ")?.[0] ||""}</span>
          </div>
        </div>
        <div className="space-y-1 pl-3">
          <NavLink
            to={"/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${isActive
                ? "bg-[#FEF4F8] text-black rounded-tl-full rounded-bl-full"
                : "hover:bg-[#244A78] rounded-lg text-white"
              }`
            }
          >
            {() => (
              <>
                <img
                  src={supplierTabs?.[0].icon}
                  alt={supplierTabs?.[0].name}
                  className={`w-4 h-4 transition-all `}
                />
                <span className="text-sm font-medium">
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
        </div>

        {/* Menu */}
        <div className="space-y-1 pl-3">

          {/* Suppliers */}
          <div>
            <div
              // onClick={() => setOpenSupplier(!openSupplier)}
              onClick={supplierTabClicked}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#244A78] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Building2 size={18} />
                <span>Suppliers</span>
              </div>
              {openSupplier ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {/* Submenu */}
            {openSupplier && (
              <div className="ml-6 mt-1 space-y-1">
                {supplierTabs.map((tab) => (
                  <NavLink
                    to={tab.path}
                    key={tab.name}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${isActive
                        ? "bg-[#FEF4F8] text-black rounded-tl-full rounded-bl-full"
                        : "hover:bg-[#244A78] rounded-lg text-white"
                      }`
                    }
                  >
                    {() => (
                      <>
                        <img
                          src={tab.icon}
                          alt={tab.name}
                          className={`w-4 h-4 transition-all `}
                        />
                        <span className="text-sm font-medium">
                          {tab.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="pt-4" />

          {/* Static Menu Items */}
          {staticMenuTabs?.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#244A78] cursor-pointer"
            >
              <Settings size={18} />
              <span>{item}</span>
            </div>
          ))}

          {/* Policies */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#244A78] cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield size={18} />
              <span>Policies</span>
            </div>
            <ChevronRight size={16} />
          </div>

          {/* Admin */}
          <div>
            <div
              onClick={adminTabClicked}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#244A78] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Shield size={18} />
                <span>{userDetails?.role?.toUpperCase()||"Admin"}</span>
              </div>
              {openAdmin ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>

            {/* Submenu */}
            {openAdmin && (
              <div className="ml-6 mt-1 space-y-1">
                {filteredTabs?.map((tab) => (
                  <NavLink
                    to={tab?.path}
                    key={tab?.name}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 cursor-pointer transition-all ${isActive
                        ? "bg-[#FEF4F8] text-black rounded-tl-full rounded-bl-full"
                        : "hover:bg-[#244A78] rounded-lg text-white"
                      }`
                    }
                  >
                    {() => (
                      <>
                        <img
                          src={tab.icon}
                          alt={tab.name}
                          className={`w-4 h-4 transition-all `}
                        />
                        <span className="text-sm font-medium">
                          {tab.name}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-6"></div>
    </div>
  );
}

export default Sidebar;