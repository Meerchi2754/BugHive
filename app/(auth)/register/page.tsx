"use client";

import { oAuth } from "@/app/actions/action";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { redirect, useSearchParams } from "next/navigation";
import { ButtonComp } from "@/component/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailSchema,
  EmailSchemaType,
} from "@/lib/validations/emailLogin";
import { EmailAction } from "@/app/actions/auth/email.action";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function SignUpForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token?");
  const role = searchParams.get("role");
  const action = searchParams.get("action") || "register";
  const isMaintainer = role === "MAINTAINER";
  const isVerifier = role === "VERIFIER";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailSchemaType>({
    resolver: zodResolver(EmailSchema),
  });

  const onSubmit = async (data: EmailSchemaType) => {
    try {
      setIsSubmitting(true);
      const result = await EmailAction(data, role || "MAINTAINER");
      if (result) {
        if (result.method === "login") {
          toast.success("Login successful!");
          redirect("/onboarding/maintiner");
        }
      }
      toast.success("Verification email sent.");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown Error";
      setIsSubmitting(false);
      setError("root", {
        message: "Something went wrong. Please try again.",
      });
      toast.error(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const heading = isVerifier
    ? "Create your verifier account"
    : "Sign into your account";

  const subheading = isVerifier
    ? "Submit verifications and review contributions"
    : isMaintainer
    ? "Manage your projects and review talent"
    : "Access your contributor dashboard";

  return (
    <motion.div
      className="w-full max-w-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Heading */}
      <motion.div variants={itemVariants} className="mb-8">
        <p
          style={{
            color: "#64748b",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "6px",
          }}
        >
          {role?.toLowerCase() ?? "sign in"}
        </p>
        <h2
          style={{
            color: "#0f172a",
            fontWeight: 700,
            fontSize: "1.75rem",
            lineHeight: 1.25,
          }}
        >
          {heading}
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "6px" }}>
          {subheading}
        </p>
      </motion.div>

      {isMaintainer ? (
        /* ── Email / password form for Maintainers ── */
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              style={{ color: "#374151", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Email address
            </label>
            <input
              id="email"
              type="text"
              placeholder="you@example.com"
              {...register("email")}
              className="bg-white border-[1.5px] border-[#e2e8f0] focus:border-[#60a5fa] rounded-[10px] px-[14px] py-[10px] text-[0.9rem] text-[#0f172a] outline-none transition-colors duration-200"
            />
            {errors.email && (
              <p style={{ color: "#ef4444", fontSize: "0.78rem" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              style={{ color: "#374151", fontSize: "0.85rem", fontWeight: 500 }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="bg-white border-[1.5px] border-[#e2e8f0] focus:border-[#60a5fa] rounded-[10px] px-[14px] py-[10px] text-[0.9rem] text-[#0f172a] outline-none transition-colors duration-200"
            />
            {errors.password && (
              <p style={{ color: "#ef4444", fontSize: "0.78rem" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>
              {errors.root.message}
            </p>
          )}

          <button
            id="submit-btn"
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "4px",
              background: isSubmitting ? "#93c5fd" : "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "0.92rem",
              fontWeight: 600,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isSubmitting ? "Signing in…" : "Continue"}
          </button>
        </motion.form>
      ) : (
        /* ── OAuth buttons for Contributors & Verifiers ── */
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <ButtonComp
            id="github-btn"
            className="flex items-center justify-center gap-3 w-full cursor-pointer"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              padding: "13px 20px",
              color: "#0f172a",
              fontSize: "0.92rem",
              fontWeight: 500,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            icon={<FaGithub size={20} />}
            onClick={() => role && oAuth("github", role!, action, token)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            text="Continue with GitHub"
          />

          <ButtonComp
            id="google-btn"
            className="flex items-center justify-center gap-3 w-full cursor-pointer"
            style={{
              background: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "12px",
              padding: "13px 20px",
              color: "#0f172a",
              fontSize: "0.92rem",
              fontWeight: 500,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            icon={<FcGoogle size={20} />}
            onClick={() => role && oAuth("google", role!, action, token)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            text="Continue with Google"
          />
        </motion.div>
      )}

      <motion.p
        variants={itemVariants}
        style={{
          color: "#94a3b8",
          fontSize: "0.78rem",
          textAlign: "center",
          marginTop: "28px",
        }}
      >
        By continuing you agree to our Terms &amp; Privacy Policy
      </motion.p>
    </motion.div>
  );
}

export default function SignUp() {
  return (
    <Suspense fallback={<div style={{ color: "#64748b" }}>Loading…</div>}>
      <SignUpForm />
    </Suspense>
  );
}
