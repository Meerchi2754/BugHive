"use client";
import { useTheme } from "@/context/themeContext";

export function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl border p-3 transition-colors ${
        isDark
          ? "bg-zinc-900/80 border-zinc-700 hover:border-zinc-500"
          : "bg-white border-gray-200 hover:border-gray-400 shadow-xs"
      }`}
    >
      <div
        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
          isDark ? "text-zinc-400" : "text-gray-500"
        }`}
      >
        {icon}
        {label}
      </div>
      <p
        className={`text-sm font-medium mt-1 ${
          isDark ? "text-[#F3F4F6]" : "text-gray-900"
        }`}
      >
        {value?.trim() ? (
          value
        ) : (
          <span className={`${isDark ? "text-zinc-500" : "text-gray-400"} italic`}>
            Not set
          </span>
        )}
      </p>
    </div>
  );
}
