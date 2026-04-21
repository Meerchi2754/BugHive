"use client";

import { oAuth } from "@/app/actions/action";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { redirect, useSearchParams } from "next/navigation";
import { ButtonComp } from "@/component/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema, EmailSchemaType } from "@/lib/validations/emailLogin";
import { EmailAction } from "@/app/actions/auth/email.action";
import { useState } from "react";
import { toast } from "react-toastify";

export default function SignUp() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token?");
  const role = searchParams.get("role");
  const action = searchParams.get("action") || "register";
  const isMaintainer = role === "MAINTAINER";
  const isVerifier = role === "VERIFIER";
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log("Role:", role);
  console.log("Action:", action);
  console.log("Token:", token);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EmailSchemaType>({ resolver: zodResolver(EmailSchema) });

  const onSubmit = async (data: EmailSchemaType) => {
    try {
      setIsSubmitting(true);
      const result = await EmailAction(data, role || "MAINTAINER");
      if (result) {
        if (result.method === "login") {
          toast.success("LOGIN SUCCESSFULL");
          redirect("/onboarding/maintiner");
        }
      }

      toast.success("Email sent for Verification.");
    } catch (error: any) {
      setIsSubmitting(false);
      setError("root", { message: "Something went wrong. Please try again." });
      toast.error(`ERROR:${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!isVerifier ? (
        <h2 className="text-black text-4xl ">Sign into your account</h2>
      ) : (
        <h2 className="text-center text-black text-4xl">
          Create a free account to submit your verification
        </h2>
      )}

      <div className="flex flex-col gap-10 mt-9">
        {!isMaintainer ? (
          <ButtonComp
            className="flex items-center  gap-2 bg-white p-3 text-black rounded-4xl cursor-pointer border hover:bg-gray-200"
            icon={<FaGithub size={30} />}
            onClick={() => role && oAuth("github", role!, action, token)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.2 }}
            transition={{ duration: 1 }}
            text="Sign in With Github"
          />
        ) : (
          <div className="bg-gray-400 p-10 w-90">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <label>Email:</label>
                <input
                  type="text"
                  placeholder="Enter Your email"
                  {...register("email")}
                  className="bg-mist-500 rounded text-black p-1"
                />
                {errors.email && (
                  <p className="text-red-700">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label>Password:</label>
                <input
                  type="password"
                  placeholder="Enter Your Password"
                  className="bg-mist-500 text-black p-1 rounded"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-2">
                <ButtonComp
                  type="submit"
                  disabled={isSubmitting}
                  text={isSubmitting ? "Loading..." : "Submit"}
                  className="w-full bg-mist-700 rounded-full  p-2 cursor-pointer hover:bg-gray-950"
                />
              </div>
              {errors.root && (
                <p className="text-red-600">{errors.root.message}</p>
              )}
            </form>
          </div>
        )}

        <ButtonComp
          className="flex items-center  gap-2 bg-white p-3 text-black rounded-4xl cursor-pointer border hover:bg-gray-200"
          icon={<FcGoogle size={30} />}
          onClick={() => role && oAuth("google", role!, action, token)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.2 }}
          transition={{ duration: 1 }}
          text="Sign in With Google"
        />
      </div>
    </>
  );
}
