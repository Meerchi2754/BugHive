"use client";
import { AnimatePresence, motion } from "motion/react";
import { Step1Form } from "@/component/onboarding/Step1";
import { Step2Form } from "@/component/onboarding/Step2";
import { Step3Form } from "@/component/onboarding/Step3";
import { Step4Form } from "@/component/onboarding/Step4";
import { useMultiStepForm } from "@/context/formContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { refreshCookie } from "@/utils/refreshCookie";
import { ButtonComp } from "@/component/ui/button";
import { updateOnboarding } from "@/app/actions/onboarding/updateOnboarding";
import { toast } from "react-toastify";

export default function Onboard() {
  const { form, currentPosition, nextStep } = useMultiStepForm();
  const steps = [<Step1Form />, <Step2Form />, <Step3Form />, <Step4Form />];
  const stepLabel = ["Profile", "Skills", "Availability", "Github"];
  const router = useRouter();
  const { refreshUser, user } = useAuth();
  const currentStep = user?.onboarding_step!;
  const isLast = currentStep === steps.length - 1;
  // console.log("CURRENT STEP:", currentStep);
  // console.log("LAST STEP:", isLast);

  const onSubmit = form.handleSubmit(async (data) => {
    console.log("START");
    await refreshCookie();
    await refreshUser();
    if (user?.github_connected) {
      toast.success("Onboarding Compelete");
      router.push("/dashboard/claims");
      return;
    }
  });
  const progress = ((currentStep! + 1) / steps.length) * 100;

  const toDashboard = async () => {
    try {
      await refreshUser();
      await refreshCookie();
      const res = await updateOnboarding(user?.email!);
      if (res) {
        toast.success("Onboarding Compelete");
      }
    } catch (error) {
      toast.error("Onboarding Failed");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="bg-gray-100 w-150 p-4 rounded">
          <h2 className="font-bold p-2">OnBoarding Form</h2>
          <div className="bg-gray-300 h-2 rounded">
            <div
              style={{
                width: `${progress}%`,
                background: "black",
                height: "8px",
              }}
              className="transition-all duration-300"
            />
            <div>
              <h3 className="px-3 font-bold text-lg">{`${stepLabel[currentPosition]}`}</h3>
              <span className=" text-sm text-gray-600 px-2 py-0.5">{`STEP ${currentStep! + 1} OF ${steps.length}`}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              className="mt-5 p-4"
              key={currentPosition}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 10 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {steps[currentStep!]}
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-row justify-end p-2 ">
            {!isLast ? (
              <ButtonComp
                type="button"
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-900 cursor-pointer"
                onClick={nextStep}
                text="Next"
              />
            ) : (
              <ButtonComp
                type="submit"
                onClick={toDashboard}
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 cursor-pointer"
                text="Submit"
              />
            )}
          </div>
        </div>
      </form>
    </>
  );
}
