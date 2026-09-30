"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiBadgeCheck } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { PiCardsThree } from "react-icons/pi";
import { useTheme } from "@/context/themeContext";

export function ContributorSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isActive = (path: string) => pathname.includes(path);

  return (
    <div
      className="flex flex-col w-52 px-4 py-6 gap-3 transition-colors duration-150"
      style={{
        backgroundColor: isDark ? "#090B0D" : "#ffffff",
        borderRight: `1px solid ${isDark ? "#1f2328" : "#e5e7eb"}`,
      }}
    >
      <div
        className={`flex flex-row gap-2.5 items-center px-3 py-2 rounded-lg transition-colors ${
          isActive("/dashboard/verifier")
            ? isDark
              ? "bg-[#161b22]"
              : "bg-gray-100"
            : ""
        }`}
      >
        <BiBadgeCheck
          size={20}
          color={isActive("/dashboard/verifier") ? "#10b981" : isDark ? "#8b949e" : "#64748b"}
        />
        <Link
          href="/dashboard/verifier"
          className={`text-sm font-medium transition-colors ${
            isActive("/dashboard/verifier")
              ? "text-emerald-500 font-semibold"
              : isDark
              ? "text-[#8b949e] hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Verify Claims
        </Link>
      </div>

      <div
        className={`flex flex-row gap-2.5 items-center px-3 py-2 rounded-lg transition-colors ${
          isActive("/dashboard/claims")
            ? isDark
              ? "bg-[#161b22]"
              : "bg-gray-100"
            : ""
        }`}
      >
        <PiCardsThree
          size={20}
          color={isActive("/dashboard/claims") ? "#10b981" : isDark ? "#8b949e" : "#64748b"}
        />
        <Link
          href="/dashboard/claims"
          className={`text-sm font-medium transition-colors ${
            isActive("/dashboard/claims")
              ? "text-emerald-500 font-semibold"
              : isDark
              ? "text-[#8b949e] hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Claims
        </Link>
      </div>

      <div
        className={`flex flex-row gap-2.5 items-center px-3 py-2 rounded-lg transition-colors ${
          isActive("/profile")
            ? isDark
              ? "bg-[#161b22]"
              : "bg-gray-100"
            : ""
        }`}
      >
        <FaUser
          size={16}
          color={isActive("/profile") ? "#10b981" : isDark ? "#8b949e" : "#64748b"}
        />
        <Link
          href="/profile"
          className={`text-sm font-medium transition-colors ${
            isActive("/profile")
              ? "text-emerald-500 font-semibold"
              : isDark
              ? "text-[#8b949e] hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Profile
        </Link>
      </div>
    </div>
  );
}
