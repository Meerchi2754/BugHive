"use client";
import { ButtonComp } from "@/component/ui/button";
import { rejectVerification } from "@/services/dashboard/verifier/rejectVerification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "@/context/themeContext";

export function DeclineModal({
  close,
  claimId,
}: {
  close: () => void;
  claimId: string;
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [reason, setReason] = useState("");

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold">Reason for Decline:</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`text-xs p-2 rounded border outline-none ${
            isDark
              ? "bg-[#111519] border-[#24282D] text-white focus:border-red-500"
              : "bg-gray-50 border-gray-300 text-gray-900 focus:border-red-500"
          }`}
          placeholder="Enter reason..."
        />
        <div className="flex gap-2 justify-end mt-1">
          <ButtonComp
            text="Cancel"
            onClick={close}
            className={`px-3 py-1 text-xs rounded border cursor-pointer ${
              isDark
                ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          />
          <ButtonComp
            text="Confirm Decline"
            onClick={async () => {
              const res = await rejectVerification(claimId);
              if (res) {
                toast.success("Claim Declined!");
                close();
                router.push("/dashboard/verifier");
                return;
              }
            }}
            className="px-3 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
