// Example usage of ClaimCard component

import { ClaimCard } from "./ClaimCard";

export default function ClaimCardExample() {
  // Example data structure matching your schema
  const exampleClaim = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    claim_title: "Fixed critical authentication bug in user login flow",
    claim_type: "BUG FIX" as const,
    claim_impact_score: 85,
    pr_url: "https://github.com/example/repo/pull/123",
    created_at: "2024-01-15T10:30:00Z",
    description: "Resolved a race condition in the authentication middleware that was causing intermittent login failures for users with special characters in their usernames.",
    verifications: [
      {
        id: "ver-1",
        verifier: {
          username: "john_reviewer",
          github_username: "johndev",
        },
        technical_complexity: 4.5,
        codebase_impact: 5.0,
        collaboration_quality: 4.0,
        descriptions: "Excellent bug fix! The contributor identified a complex race condition and implemented a robust solution with comprehensive test coverage. The PR was well-documented and easy to review.",
      },
      {
        id: "ver-2",
        verifier: {
          username: "sarah_tech",
          github_username: "sarahcodes",
        },
        technical_complexity: 4.0,
        codebase_impact: 4.5,
        collaboration_quality: 5.0,
        descriptions: "Great work on this critical fix. The contributor was very responsive to feedback and made thoughtful improvements based on our security review.",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Claim Card Example</h1>
      <ClaimCard claim={exampleClaim} />
    </div>
  );
}
