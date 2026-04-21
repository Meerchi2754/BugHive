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

const TOTAL_STEPS = 3;

// --- Types ---
interface StepRatings {
  technicalComplexity: number;
  codebaseImpact: number;
  collaborationQuality: number;
}

interface StepReview {
  description: string;
  wouldRecommend: boolean;
}

// --- Sub-components ---
function ProgressBar({ current, total }: { current: number; total: number }) {
  const progress = (current / total) * 100;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-green-600">{`STEP ${current} OF ${total}`}</span>
      <div className="bg-gray-300 h-2 rounded overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="bg-green-600 h-2 rounded transition-all duration-300"
        />
      </div>
    </div>
  );
}

function DeclineModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="border border-white m-1" />
      <label>Reason:</label>
      <input
        type="text"
        className="bg-mist-800 border border-mist-500 rounded text-white p-1"
        placeholder="Enter your Reason:"
      />
      <ButtonComp
        text="Close"
        onClick={onClose}
        className="p-2 bg-zinc-700 rounded cursor-pointer hover:bg-zinc-500"
      />
    </div>
  );
}

function StepNavigation({
  currentStep,
  totalSteps,
  isSubmitting,
  onBack,
  onNext,
}: {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  const isLastStep = currentStep === totalSteps;
  return (
    <div className="flex justify-between">
      <ButtonComp
        text="Back"
        className="p-2 bg-zinc-700 rounded cursor-pointer hover:bg-zinc-500"
        onClick={onBack}
      />
      <ButtonComp
        text={isLastStep ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
        className="p-2 bg-zinc-700 rounded cursor-pointer hover:bg-zinc-500"
        onClick={onNext}
      />
    </div>
  );
}

// --- Loading State ---
function LoadingState() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center p-6">
        <p className="animate-pulse text-center text-2xl">Loading...</p>
      </div>
    </>
  );
}

// --- Main Component ---
export default function ClaimToken({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<JWTPAYLOAD>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [ratings, setRatings] = useState<StepRatings>({
    technicalComplexity: 2.5,
    codebaseImpact: 3,
    collaborationQuality: 1,
  });

  const [review, setReview] = useState<StepReview>({
    description: "",
    wouldRecommend: false,
  });

  useEffect(() => {
    const decrypt = async () => {
      const result = await jwtVerify(token);
      setData(result);
    };
    decrypt();
  }, [token]);

  if (!data?.claimId) return <LoadingState />;

  const handleRatingChange = (key: keyof StepRatings) => (value: number) =>
    setRatings((prev) => ({ ...prev, [key]: value }));

  const handleReviewChange =
    (key: keyof StepReview) => (value: string | boolean) =>
      setReview((prev) => ({ ...prev, [key]: value }));

  const handleNext = async () => {
    if (currentStep > TOTAL_STEPS) return;

    if (currentStep === TOTAL_STEPS) {
      setIsSubmitting(true);
      const result = await updateVerification(
        data.claimId,
        ratings.technicalComplexity,
        ratings.codebaseImpact,
        ratings.collaborationQuality,
        review.description,
        review.wouldRecommend,
      );
      setIsSubmitting(false);
      result ? toast.success("Update Success!") : toast.error("Update Failed!");
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep <= 1) return;
    setCurrentStep((prev) => prev - 1);
  };

  const steps = [
    <Step1 claimId={data.claimId} />,
    <Step2
      technicalComplexity={ratings.technicalComplexity}
      setTechnicalComplexity={handleRatingChange("technicalComplexity")}
      codebaseImpact={ratings.codebaseImpact}
      setCodebaseImpact={handleRatingChange("codebaseImpact")}
      collaborationQuality={ratings.collaborationQuality}
      setCollaborationQuality={handleRatingChange("collaborationQuality")}
    />,
    <Step3
      description={review.description}
      setDescription={handleReviewChange("description") as (v: string) => void}
      wouldRecommend={review.wouldRecommend}
      setWouldRecommed={
        handleReviewChange("wouldRecommend") as (v: boolean) => void
      }
      {...ratings}
    />,
  ];

  return (
    <>
      <Navbar />
      <div className="flex justify-center p-6">
        <div className="bg-mist-900 border border-gray-200 rounded-xl p-3 w-full max-w-md relative">
          <h3 className="font-medium mb-5 text-center text-2xl">
            Verify Claim
          </h3>

          <ButtonComp
            text="Decline"
            onClick={() => setIsModal((prev) => !prev)}
            className="absolute left-225 top-25 p-2 bg-red-500 rounded border border-red-600 hover:bg-red-400 cursor-pointer"
          />

          <div className="flex flex-col gap-5">
            <ProgressBar current={currentStep} total={TOTAL_STEPS} />

            <AnimatePresence mode="wait">
              <motion.div
                className="p-2"
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                {steps[currentStep - 1]}
              </motion.div>
            </AnimatePresence>

            <StepNavigation
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              isSubmitting={isSubmitting}
              onBack={handleBack}
              onNext={handleNext}
            />
          </div>

          {isModal && <DeclineModal onClose={() => setIsModal(false)} />}
        </div>
      </div>
    </>
  );
}
