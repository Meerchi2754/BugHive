import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function Step3({
  description,
  setDescription,
  wouldRecommend,
  setWouldRecommed,
  technicalComplexity,
  codebaseImpact,
  collaborationQuality,
}: {
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  wouldRecommend: boolean;
  setWouldRecommed: Dispatch<SetStateAction<boolean>>;
  technicalComplexity: number;
  codebaseImpact: number;
  collaborationQuality: number;
}) {
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();

  useEffect(() => {
    setDescriptionError(false);
    setErrorMessage(null);
    if (description.length <= 50) {
      setDescriptionError(true);
      setErrorMessage("Min Length Should be 50.");
    }
    if (description.length > 100) {
      setDescriptionError(true);
      setErrorMessage("Max Length Should be 100.");
    }
  }, [description]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
          <p className="text-md">Technical Complexity:</p>
          <p className="font-bold">{technicalComplexity}</p>
        </div>
        <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
          <p>Codebase Impact:</p>
          <p className="font-bold">{codebaseImpact}</p>
        </div>
        <div className="flex flex-col items-start justify-center rounded bg-neutral-50 dark:bg-neutral-800 p-1 gap-1 border border-neutral-600">
          <p>Collaboration Quality:</p>
          <p className="font-bold">{collaborationQuality}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label>Description:</label>
        <textarea
          className={`border rounded p-2 ${descriptionError ? " border-red-500" : "border-zinc-700"}`}
          placeholder="Enter your reason"
          maxLength={100}
          value={description}
          onChange={(e) => setDescription(String(e.target.value))}
        />
        <p className="text-sm text-right text-gray-500">
          {description.length}/250
        </p>
        {descriptionError && <p className="text-red-500">{errorMessage}</p>}
      </div>

      <div className="flex flex-row justify-between gap-2">
        <label>Would Recommend</label>
        <div>
          <button
            type="button"
            onClick={() => setWouldRecommed((prev) => !prev)}
            className={`w-10 h-6 rounded-full transition-color relative ${wouldRecommend ? "bg-black" : "bg-gray-200"} cursor-pointer`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white border border-gray-400 rounded-full transition-colors  ${wouldRecommend ? "bg-black" : "bg-gray-200 left-1"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
