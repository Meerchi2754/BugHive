import { Dispatch, SetStateAction, useState } from "react";

export function Step2({
  technicalComplexity,
  setTechnicalComplexity,
  codebaseImpact,
  setCodebaseImpact,
  collaborationQuality,
  setCollaborationQuality,
}: {
  technicalComplexity: number;
  setTechnicalComplexity: Dispatch<SetStateAction<number>>;
  codebaseImpact: number;
  setCodebaseImpact: Dispatch<SetStateAction<number>>;
  collaborationQuality: number;
  setCollaborationQuality: Dispatch<SetStateAction<number>>;
}) {
  const TechnicalComplexityLabel = [
    "Low Complexity",
    "Simple",
    "Moderate",
    "Complex",
    "High Complex",
  ];

  const codebaseImpactLabel = [
    "Negligible",
    "Minor",
    "Moderate",
    "Significant",
    "Critical",
  ];

  const collaborationQualityLabel = [
    "Poor",
    "Needs Improvement",
    "Satisfactory",
    "Good",
    "Excellent",
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col">
        <label>
          Technical Complexity: {technicalComplexity} -{" "}
          <span className="text-zinc-300 font-semibold">
            {TechnicalComplexityLabel[Math.round(technicalComplexity - 1)]}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step={0.1}
          value={technicalComplexity}
          onChange={(e) => setTechnicalComplexity(Number(e.target.value))}
        />
      </div>

      <div className="flex flex-col">
        <label>
          Codebase Impact: {codebaseImpact} -
          <span className="text-zinc-300  font-semibold">
            {codebaseImpactLabel[Math.round(codebaseImpact - 1)]}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step={0.1}
          value={codebaseImpact}
          onChange={(e) => setCodebaseImpact(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col">
        <label>
          Collaboration Quality: {collaborationQuality} -
          <span className="text-zinc-300  font-semibold">
            {collaborationQualityLabel[Math.round(collaborationQuality - 1)]}
          </span>
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step={0.1}
          value={collaborationQuality}
          onChange={(e) => setCollaborationQuality(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
