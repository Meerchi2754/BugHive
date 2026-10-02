"use client";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { MdNotificationsActive } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { LuMoon } from "react-icons/lu";

import ProfileDropdown from "@/component/common/ProfileDropdown";

export default function Navbar() {
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [impactScore] = useState<number>(0);

  return (
    <motion.div
      className="relative z-50 h-16 flex flex-row justify-between items-center transition-colors duration-150"
      style={{
        backgroundColor: isDark ? "#090B0D" : "#ffffff",
        borderBottom: `1px solid ${isDark ? "#1f2328" : "#e5e7eb"}`,
      }}
    >
      {/* Logo */}
      <div>
        <h1 className={`text-4xl px-5 font-bitcount transition-colors ${isDark ? "text-white" : "text-gray-900"}`}>
          Bug
          <span className="text-green-500 font-bitcount">Hive</span>
        </h1>
      </div>

      {/* Center — welcome + impact score */}
      <div className="px-2 flex flex-row items-center gap-6">
        <h2 className={`text-sm font-medium transition-colors ${isDark ? "text-[#8B949E]" : "text-gray-600"}`}>
          Welcome{" "}
          <span className="text-emerald-500 font-semibold">
            {user?.github_username ?? user?.username ?? "User"}
          </span>
        </h2>
        <div className={`h-4 w-px transition-colors ${isDark ? "bg-[#24282D]" : "bg-gray-300"}`} />
        <h2 className={`text-sm transition-colors ${isDark ? "text-[#8B949E]" : "text-gray-600"}`}>
          Impact Score:{" "}
          <span className={`font-semibold tabular-nums transition-colors ${isDark ? "text-[#F3F4F6]" : "text-gray-900"}`}>
            {impactScore}
          </span>
        </h2>
      </div>

      {/* Right — theme toggle + notifications + avatar dropdown */}
      <div className="flex flex-row items-center px-4 gap-2">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`p-2 rounded-[8px] transition-all duration-150 cursor-pointer ${
            isDark
              ? "text-[#8B949E] hover:text-[#F3F4F6] hover:bg-[#1f2328]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          {isDark ? (
            <CiLight size={20} />
          ) : (
            <LuMoon size={18} />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <ButtonComp
            type="button"
            className={`p-2 rounded-[8px] transition-all duration-150 cursor-pointer ${
              isDark
                ? "text-[#8B949E] hover:text-[#F3F4F6] hover:bg-[#1f2328]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            icon={<MdNotificationsActive size={19} />}
          />
          {hasNotification && (
            <span
              className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border rounded-full ${
                isDark ? "border-[#090B0D]" : "border-white"
              }`}
            />
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="ml-1">
          <ProfileDropdown avatarSize={32} />
        </div>
      </div>
    </motion.div>
  );
}
