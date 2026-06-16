# Maintainer Server Actions

## searchContributors.action.ts

A server action that searches for contributors based on filters. This runs on the server for better performance and security.

### How it works:

1. **Step 1: Filter by Username (Most Specific)**
   - If `username` is provided, search for contributors whose username contains the search term
   - Uses case-insensitive matching (`ilike`)

2. **Step 2: Filter by Keyword (Alternative to Username)**
   - If no username filter, search across username, bio, and headline
   - Only applies if username filter is not used

3. **Step 3: Filter by Ecosystem**
   - If ecosystem array provided, filter users whose ecosystem overlaps with the selected values
   - Uses PostgreSQL array overlap operator

4. **Step 4: Filter by Languages**
   - If languages array provided, filter users whose languages overlap with selected values

5. **Step 5: Filter by Availability**
   - If "remote" selected, filter to only remote-available contributors

6. **Step 6: Fetch Verified Claims**
   - For all matching users, fetch their verified claims
   - Only includes claims with `verification_status = "ACCEPT"`

7. **Step 7: Filter by Claim Type**
   - If claim types specified, filter each user's claims to matching types
   - Examples: "BUG FIX", "FEATURE", "PERFORMANCE", etc.

8. **Step 8: Calculate Impact Score**
   - Sum up `claim_impact_score` for each user's filtered claims
   - Used for sorting and minimum threshold

9. **Step 9: Filter by Minimum Impact Score**
   - If `minImpactScore` provided, exclude users below threshold
   - Applied after claim type filtering for accuracy

10. **Step 10: Sort Results**
    - Sort contributors by total impact score (descending)
    - Highest impact contributors appear first

### Usage:

```typescript
import { searchContributorsAction } from "@/app/actions/maintainer/searchContributors.action";

const response = await searchContributorsAction({
  username: "john",          // Search by username
  ecosystem: ["React", "Node.js"],
  minImpactScore: 50,
  claimTypes: ["BUG FIX", "FEATURE"],
  languages: ["JavaScript", "TypeScript"],
  availability: "remote",
  keyword: "full stack"      // Alternative to username
});

if (response.success) {
  console.log(response.data); // Array of contributors
} else {
  console.error(response.error);
}
```

### Response Format:

```typescript
{
  success: boolean;
  data?: ContributorSearchResult[];  // If success
  error?: string;                     // If failure
}
```

### Benefits of Server Action:

- ✅ Runs on server (no client-side database calls)
- ✅ More secure (credentials never exposed to client)
- ✅ Better performance (direct database access)
- ✅ Automatic error handling
- ✅ TypeScript type safety
