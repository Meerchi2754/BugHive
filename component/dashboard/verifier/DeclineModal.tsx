import { ButtonComp } from "@/component/ui/button";
import { rejectVerification } from "@/services/dashboard/verifier/rejectVerification";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export function DeclineModal({
  close,
  claimId,
}: {
  close: () => void;
  claimId: string;
}) {
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="border border-white m-1" />
        <label>Reason:</label>
        <input
          type="text"
          className="bg-mist-800 border  border-mist-500 rounded text-white p-1"
          placeholder="Enter your Reason:"
        />
        <div className="flex gap-2 justify-end">
          <ButtonComp
            text="SUBMIT"
            onClick={async () => {
              const res = await rejectVerification("eweqwe");
              if (res) {
                toast.success("Claim Declined!");
                close();
                router.push("/verify/claims");
                return;
              }
            }}
            className="bg-blue-700 rounded p-2 border border-mist-300 hover:bg-blue-500 cursor-pointer"
          />

          <ButtonComp
            text="CLOSE"
            onClick={close}
            className="bg-mist-700 rounded p-2 border border-mist-300"
          />
        </div>
      </div>
    </div>
  );
}
