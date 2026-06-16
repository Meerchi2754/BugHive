🎯 Mission Statement
BugHive is a structured open source contribution portfolio platform that creates verified, credible profiles for developers by linking every claimed contribution to live GitHub pull requests and subjecting them to peer review through a structured impact rubric.

🏗️ Core Architecture
Technology Stack
Frontend: Next.js 16 with React 19, TypeScript
Styling: TailwindCSS with custom components
Database: Supabase (PostgreSQL)
Authentication: Supabase Auth (Email + OAuth)
State Management: TanStack Query (React Query)
Forms: React Hook Form with Zod validation
GitHub Integration: Octokit API
Deployment: Next.js App Router architecture
Database Schema
Users: Profile data, roles, onboarding status, GitHub integration
Claims: Contribution claims linked to PR URLs with impact scores
PR Table: Detailed GitHub PR metadata (additions, deletions, file changes)
Verifications: Peer review data with structured scoring rubrics
👥 User Ecosystem
Three Primary Roles
Contributors/Developers: Submit and showcase their open source contributions
Verifiers/Project Managers: Review and validate contribution claims
Maintainers/Hiring Managers: Evaluate contributor portfolios for hiring decisions
User Journey
Registration: Role-based signup with GitHub OAuth integration
Onboarding: 4-step profile completion (username, bio/skills, availability, GitHub connection)
Contribution Management: Submit claims, upload evidence, track verification status
