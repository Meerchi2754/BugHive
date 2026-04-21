import { addVerifier } from "@/app/actions/claims/addVerifier";
import { ButtonComp } from "@/component/ui/button";
import { useAuth } from "@/context/authContext";
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

  const handleVerification = async (
    claimId: string,
    verifier_email: string,
  ) => {
    try {
      console.log("STARTED MAIL");
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
        <p>Please Verify it and increase thier Impact Score.</p>
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
          toast.success(`EMAIL SEND`);
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

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  return (
    <div className="flex flex-row items-center px-2 gap-2 hover:border hover:border-zinc-500 py-2 justify-between">
      {github_avatar_url ? (
        <Image
          src={github_avatar_url ?? "/profile.png"}
          width={30}
          height={30}
          alt="github avttar url"
          className="border rounded-full cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all"
        />
      ) : (
        <div className="w-7.5 h-7.5 rounded-full border bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 shrink-0">
          {icon}
        </div>
      )}

      <p className="text-sm">{verifier_email}</p>

      <ButtonComp
        type="button"
        text={isSubmitting ? "Sending..." : "Send"}
        className={`bg-zinc-900 p-2 rounded border border-zinc-700 hover:border-zinc-200 disabled:${isSubmitting} ${isSubmitting ? " opacity-55  cursor-not-allowed " : "border-zinc-700 hover:border-zinc-200 cursor-pointer "}`}
        onClick={() => handleVerification(claimId, verifier_email)}
      />
    </div>
  );
}
