"use client";
import { addVerifier } from "@/app/actions/claims/addVerifier";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
import { useTheme } from "@/context/themeContext";
import { sendMail } from "@/lib/mailer/mailer";
import { generateTokenFn } from "@/utils/dashboard/contributors/generateToken";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function UserCard({
  github_avatar_url,
  shareModal,
  claimId,
  verifier_email,
  icon,
}: {
  github_avatar_url?: string;
  shareModal: () => void;
  claimId: string;
  verifier_email: string;
  icon?: React.ReactNode;
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleVerification = async (
    claimId: string,
    verifier_email: string,
  ) => {
    try {
      setIsSubmitting(true);
      const token = await generateTokenFn({
        claimId: claimId,
        contributor_email: user?.email!,
        verifier_email: verifier_email!,
        sended_at: new Date().toLocaleDateString("en-US"),
      });
      const response = await sendMail({
        email: user?.email!,
        sendTo: verifier_email,
        subject: `VERIFY ${user?.github_username} CLAIMS`,
        text: `Demo EMAIL BODY. Token:${token}`,
        html: `
        <h2>${user?.username} sent you a claim</h2>
        <p>Please Verify it and increase their Impact Score.</p>
        <a href="http://localhost:3000/api/verifier/callback?token=${token}">Verify Claim</a>
          <p>BugHive Private Limited</p>`,
      });
      if (response?.messageId) {
        const data = await addVerifier(
          user?.id!,
          verifier_email,
          claimId,
          token!,
        );
        if (data) {
          toast.success(`EMAIL SENT`);
          setIsSubmitting(false);
          shareModal();
        }
      } else {
        toast.error(`EMAIL FAILED`);
        setIsSubmitting(false);
        shareModal();
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error("Email Send Failed");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`flex flex-row items-center px-3 py-2 gap-2 rounded-lg transition-colors justify-between ${
        isDark ? "hover:bg-[#161b22]" : "hover:bg-gray-100"
      }`}
    >
      {github_avatar_url ? (
        <Image
          src={github_avatar_url ?? "/profile.png"}
          width={28}
          height={28}
          alt="github avatar"
          className="rounded-full cursor-pointer ring-1 ring-gray-300 dark:ring-zinc-700"
        />
      ) : (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
          isDark ? "bg-zinc-800 text-zinc-300" : "bg-gray-200 text-gray-700"
        }`}>
          {icon}
        </div>
      )}

      <p className="text-xs truncate flex-1 font-medium">{verifier_email}</p>

      <ButtonComp
        type="button"
        text={isSubmitting ? "Sending..." : "Send"}
        disabled={isSubmitting}
        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
          isDark
            ? "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
            : "bg-gray-900 hover:bg-gray-800 text-white"
        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => handleVerification(claimId, verifier_email)}
      />
    </div>
  );
}
