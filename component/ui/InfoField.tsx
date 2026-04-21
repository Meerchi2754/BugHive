"use client";
import { useAuth } from "@/context/authContext";

export function InfoField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  const { user } = useAuth();
  const isMaintainer = user?.role === "MAINTAINER";
  return (
    <div
      className={`rounded-2xl border  ${isMaintainer ? "bg-white border-black" : "bg-zinc-900 border-zinc-700"}   p-2 hover:border-zinc-500`}
    >
      <div
        className={`flex items-center gap-1.5 ${isMaintainer ? "text-black" : "text-zinc-400"}  text-xs font-medium uppercase`}
      >
        {icon}
        {label}
      </div>
      <p
        className={`text-sm ${isMaintainer ? "text-black" : "text-white"}  font-medium`}
      >
        {value?.trim() ? (
          value
        ) : (
          <span
            className={` ${isMaintainer ? "text-black" : "text-white"} italic`}
          >
            Not set
          </span>
        )}
      </p>
    </div>
  );
}
