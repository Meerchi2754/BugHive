"use client";

import { oAuth } from "@/app/actions/action";
import { FaGithub, FaCodeBranch, FaCheckCircle, FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
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
import Link from "next/link";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("token?");
  const rawRole = searchParams.get("role");
  const role = rawRole?.toUpperCase() || "CONTRIBUTOR";
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
      const result = await EmailAction(data, role);
      if (result) {
        if (result.method === "login") {
          toast.success("Login successful!");
          router.push("/onboarding/maintainer");
          return;
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

  const getRoleDetails = () => {
    if (isVerifier) {
      return {
        badge: "Verifier Workspace",
        icon: <FaCheckCircle className="text-blue-600" size={13} />,
        heading: "Sign in as Verifier",
        subheading: "Audit contributions and review live PR engineering rubrics",
      };
    }
    if (isMaintainer) {
      return {
        badge: "Maintainer Portal",
        icon: <FaBriefcase className="text-blue-600" size={13} />,
        heading: "Maintainer Account",
        subheading: "Manage repositories and discover evaluated developer talent",
      };
    }
    return {
      badge: "Contributor Workspace",
      icon: <FaCodeBranch className="text-blue-600" size={13} />,
      heading: "Sign in as Contributor",
      subheading: "Connect your GitHub to import PRs and build your verified portfolio",
    };
  };

  const roleInfo = getRoleDetails();

  return (
    <motion.div
      className="w-full max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Back to role picker */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-blue-600 transition-colors group"
        >
          <FaArrowLeft size={10} className="transition-transform group-hover:-translate-x-1" />
          <span>Change workspace role</span>
        </Link>
      </motion.div>

      {/* Role Badge and Heading */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
          {roleInfo.icon}
          <span>{roleInfo.badge}</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-zinc-900 tracking-tight">
          {roleInfo.heading}
        </h2>
        <p className="text-zinc-500 text-sm mt-1.5 leading-relaxed">
          {roleInfo.subheading}
        </p>
      </motion.div>

      {isMaintainer ? (
        /* ── Email / Password form for Maintainers ── */
        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4.5"
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-zinc-700 tracking-wide uppercase"
            >
              Work Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="maintainer@organization.com"
              {...register("email")}
              className="w-full bg-white border border-zinc-200 hover:border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 shadow-xs"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-zinc-700 tracking-wide uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••••••"
              {...register("password")}
              className="w-full bg-white border border-zinc-200 hover:border-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl px-4 py-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 shadow-xs"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-500 text-xs">{errors.root.message}</p>
          )}

          <button
            id="submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? "Authenticating…" : "Continue with Email →"}
          </button>
        </motion.form>
      ) : (
        /* ── OAuth buttons for Contributors & Verifiers ── */
        <motion.div variants={itemVariants} className="flex flex-col gap-3.5">
          <button
            type="button"
            id="github-btn"
            onClick={() => oAuth("github", role, action, token)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-zinc-900 hover:bg-black text-white font-semibold text-sm shadow-md shadow-zinc-900/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
          >
            <FaGithub size={18} className="transition-transform group-hover:scale-110" />
            <span>Continue with GitHub</span>
          </button>

          <button
            type="button"
            id="google-btn"
            onClick={() => oAuth("google", role, action, token)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 text-zinc-800 font-semibold text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
          >
            <FcGoogle size={18} className="transition-transform group-hover:scale-110" />
            <span>Continue with Google</span>
          </button>
        </motion.div>
      )}

      {/* Terms & Privacy */}
      <motion.p
        variants={itemVariants}
        className="text-zinc-400 text-xs text-center mt-8"
      >
        By continuing, you agree to BugHive&apos;s{" "}
        <Link href="/" className="text-zinc-600 hover:text-blue-600 hover:underline">
          Terms of Service
        </Link>{" "}
        &amp;{" "}
        <Link href="/" className="text-zinc-600 hover:text-blue-600 hover:underline">
          Privacy Policy
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function SignUp() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-sm text-zinc-400">
          Loading auth portal…
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
