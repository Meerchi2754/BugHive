"use client";

import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiLogOut, FiUser } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";

interface ProfileDropdownProps {
  avatarSize?: number;
}

export default function ProfileDropdown({ avatarSize = 36 }: ProfileDropdownProps) {
  const { user, role, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleNavigateProfile = () => {
    setIsOpen(false);
    router.push("/profile");
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await logout();
      toast.success("Logged out successfully");
      setIsOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to log out:", err);
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const avatarUrl = user?.github_avatar_url || "/profile.png";
  const displayName = user?.username ?? user?.github_username ?? "User";
  const displayRole = (role ?? user?.role ?? "MEMBER").toUpperCase();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Profile Photo Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User profile menu"
        title="Account & Profile"
        className={`relative flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer focus:outline-none ${
          isOpen
            ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-black scale-105"
            : "ring-1 hover:ring-2 hover:ring-emerald-500 hover:scale-105"
        } ${isDark ? "ring-[#24282D]" : "ring-gray-300"}`}
      >
        <Image
          src={avatarUrl}
          width={avatarSize}
          height={avatarSize}
          alt={`${displayName}'s profile photo`}
          unoptimized={Boolean(avatarUrl.startsWith("http"))}
          className="rounded-full object-cover bg-[#161B22]"
          style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
        />
        {/* Status indicator dot */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#090B0D]" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            aria-orientation="vertical"
            className={`absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl shadow-2xl border backdrop-blur-md z-50 overflow-hidden ${
              isDark
                ? "bg-[#0D1013]/95 border-[#24282D] text-gray-100 divide-[#1f2328]"
                : "bg-white/95 border-gray-200 text-gray-800 divide-gray-100 shadow-xl"
            }`}
          >
            {/* User Profile Header */}
            <div
              className={`p-4 border-b ${
                isDark ? "border-[#1f2328] bg-[#111519]/70" : "border-gray-100 bg-gray-50/70"
              }`}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={avatarUrl}
                  width={42}
                  height={42}
                  alt={displayName}
                  unoptimized={Boolean(avatarUrl.startsWith("http"))}
                  className="rounded-full object-cover border border-emerald-500/30 bg-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate leading-tight">
                      {displayName}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                        displayRole === "MAINTAINER"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : displayRole === "VERIFIER"
                          ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {displayRole}
                    </span>
                  </div>
                  {user?.email && (
                    <p
                      className={`text-xs truncate mt-0.5 ${
                        isDark ? "text-zinc-400" : "text-gray-500"
                      }`}
                    >
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-1.5 space-y-1">
              {/* Profile Section Item */}
              <button
                type="button"
                role="menuitem"
                onClick={handleNavigateProfile}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group ${
                  isDark
                    ? "hover:bg-[#1f2328] text-gray-200 hover:text-white"
                    : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark
                        ? "bg-zinc-800/80 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300"
                        : "bg-gray-100 text-emerald-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
                  >
                    <FiUser size={15} />
                  </span>
                  <span>Profile Section</span>
                </div>
                <FiChevronRight
                  size={15}
                  className={`transition-transform duration-150 group-hover:translate-x-0.5 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                />
              </button>

              <div
                className={`h-px my-1 ${
                  isDark ? "bg-[#1f2328]" : "bg-gray-100"
                }`}
              />

              {/* Log Out Item */}
              <button
                type="button"
                role="menuitem"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer group text-red-500 ${
                  isDark
                    ? "hover:bg-red-500/10 hover:text-red-400"
                    : "hover:bg-red-50 hover:text-red-600"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark
                        ? "bg-zinc-800/80 text-red-400 group-hover:bg-red-500/20 group-hover:text-red-300"
                        : "bg-red-50 text-red-600 group-hover:bg-red-100"
                    }`}
                  >
                    {isLoggingOut ? (
                      <AiOutlineLoading3Quarters size={15} className="animate-spin" />
                    ) : (
                      <FiLogOut size={15} />
                    )}
                  </span>
                  <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
