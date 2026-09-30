"use client";
import Navbar from "@/component/common/Navbar";
import { ContributorSidebar } from "@/component/contributor/ContributorSidebar";
import { useTheme } from "@/context/themeContext";

export default function ClaimCard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="w-full min-h-screen flex flex-col transition-colors duration-150"
      style={{
        backgroundColor: isDark ? "#090B0D" : "#ffffff",
        backgroundImage: isDark
          ? "radial-gradient(#1a1d20 1px, transparent 1px)"
          : "radial-gradient(#e5e7eb 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        color: isDark ? "#f3f4f6" : "#0f172a",
      }}
    >
      <Navbar />
      <div className="flex flex-1 items-stretch">
        <ContributorSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
