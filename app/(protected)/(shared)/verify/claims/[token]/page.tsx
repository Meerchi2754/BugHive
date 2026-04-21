"use client";
import { jwtVerify } from "@/utils/jwt/jwt";
import { use, useEffect, useState } from "react";
import { JWTPAYLOAD } from "@/types/jwtPayload";
import Navbar from "@/component/common/Navbar";
import { ButtonComp } from "@/component/ui/button";
import { Step1 } from "@/component/verifier/verify/Step1";
import { Step2 } from "@/component/verifier/verify/Step2";
import { Step3 } from "@/component/verifier/verify/Step3";
import { AnimatePresence, motion } from "motion/react";
import { updateVerification } from "@/services/dashboard/verifier/updateVerification";
import { toast } from "react-toastify";
import { rejectVerification } from "@/services/dashboard/verifier/rejectVerification";
import { useRouter } from "next/navigation";

export default function ClaimToken({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<JWTPAYLOAD>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModal, setIsModal] = useState<boolean>(false);
  const router = useRouter();

  //STEP - 2 DATA
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [technicalComplexity, setTechnicalComplexity] = useState<number>(2.5);
  const [codebaseImpact, setCodebaseImpact] = useState<number>(3);
  const [collaborationQuality, setCollaborationQuality] = useState<number>(1);

  //STEP - 3 DATA
  const [description, setDescription] = useState<string>("");
  const [wouldRecommend, setWouldRecommed] = useState<boolean>(false);

  useEffect(() => {
    const decrypt = async () => {
      const data = await jwtVerify(token);
      setData(data);
    };

    decrypt();
  }, [token]);

  const stepForm = [
    <Step1 claimId={data?.claimId!} />,
    <Step2
      technicalComplexity={technicalComplexity}
      setTechnicalComplexity={setTechnicalComplexity}
      codebaseImpact={codebaseImpact}
      setCodebaseImpact={setCodebaseImpact}
      collaborationQuality={collaborationQuality}
      setCollaborationQuality={setCollaborationQuality}
    />,
    <Step3
      description={description}
      setDescription={setDescription}
      wouldRecommend={wouldRecommend}
      setWouldRecommed={setWouldRecommed}
      technicalComplexity={technicalComplexity}
      codebaseImpact={codebaseImpact}
      collaborationQuality={collaborationQuality}
    />,
  ];
  const progress = (currentStep / 3) * 100;

  const uVerification = async () => {
    if (currentStep > 3) return;
    if (currentStep === 3) {
      if (description.length <= 5) {
        return;
      }
      setIsSubmitting(true);
      const data1 = await updateVerification(
        data?.claimId!,
        technicalComplexity,
        codebaseImpact,
        collaborationQuality,
        description,
        wouldRecommend,
      );
      if (!data1) {
        toast.error("Update Failed!");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      toast.success("Update Success!");
      router.push("/verify/claims");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <>
      <div className="flex justify-center p-6">
        <div className="bg-mist-900 border border-gray-200 rounded-xl p-3 w-full max-w-7/12">
          <div className="flex flex-row  justify-between">
            <h3 className="font-medium  text-center text-2xl flex items-center">
              Verify Claim
            </h3>
            <ButtonComp
              text="Decline"
              onClick={() => setIsModal((prev) => !prev)}
              className=" p-2 bg-red-500 rounded border border-red-600 hover:bg-red-400 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-sm text-green-600 mt-1.5 inline-block">
              {`STEP ${currentStep} OF 3`}
            </span>
            <div className="bg-gray-300 h-2 rounded overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="bg-green-600 h-2 rounded transition-all duration-300"
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                className="p-2"
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {stepForm[currentStep - 1]}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              <ButtonComp
                text="Back"
                className="p-2 bg-zinc-700 rounded cursor-pointer hover:bg-zinc-500"
                onClick={() => {
                  if (currentStep <= 1) return;
                  setCurrentStep((prev) => prev - 1);
                }}
              />

              <ButtonComp
                text={
                  currentStep === 3
                    ? isSubmitting
                      ? "Submitting...."
                      : "Submit"
                    : "Next"
                }
                className="p-2 bg-zinc-700 rounded cursor-pointer  hover:bg-zinc-500"
                onClick={uVerification}
              />
            </div>
          </div>
          {isModal && (
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
                    const res = await rejectVerification(data?.claimId!);
                    if (res) {
                      toast.success("Claim Declined!");
                      setIsModal((prev) => !prev);
                      router.push("/verify/claims");
                      return;
                    }
                  }}
                  className="bg-blue-700 rounded p-2 border border-mist-300 hover:bg-blue-500 cursor-pointer"
                />

                <ButtonComp
                  text="CLOSE"
                  onClick={() => setIsModal((prev) => !prev)}
                  className="bg-mist-700 rounded p-2 border border-mist-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
