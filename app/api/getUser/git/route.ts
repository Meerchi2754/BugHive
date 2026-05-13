import { decrypt } from "@/lib/crypto";
import { createClaims } from "@/services/dashboard/createClaims";
import { createPR } from "@/services/dashboard/createPR";
import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      providerToken,
      iv,
      pr_url,
      github_username,
      user_id,
      claim_type,
      description,
      visibility,
    } = body;

    if (!providerToken) {
      return NextResponse.json(
        { message: "Provider URL is already Present." },
        { status: 400 },
      );
    }
    const decrypted_Token = decrypt(providerToken, iv);

    const octokit = new Octokit({
      auth: decrypted_Token,
    });

    const getUser = await octokit.request("GET /user", {
      headers: {
        "X-Github-Api-Version": "2026-03-10",
      },
    });
    console.log("Verified");

    if (!getUser) {
      return NextResponse.json(
        { error: "User not Authiented" },
        { status: 400 },
      );
    }

    const url_part = pr_url.split("/");
    const owner1 = url_part[3];
    const project1 = url_part[4];
    const pullNo1 = Number(url_part[6]);

    if (owner1 !== github_username) {
      return NextResponse.json(
        {
          message: "GITHUB PR URL must match the GITHUB USERNAME",
        },
        { status: 400 },
      );
    }
    const Pr_detail = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}",
      {
        owner: owner1,
        repo: project1,
        pull_number: pullNo1,
        headers: {
          "X-Github-Api-Version": "2026-03-10",
        },
      },
    );
    console.log("PULL DONE");
    
    const PR_FILES = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
      {
        owner: owner1,
        repo: project1,
        pull_number: pullNo1,
        headers: {
          "X-Github-Api-Version": "2026-03-10",
        },
      },
    );
    console.log("FILES DONE.");
    const PR_Reviews = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner: owner1,
        repo: project1,
        pull_number: pullNo1,
        headers: {
          "X-Github-Api_Version": "2026-03-10",
        },
      },
    );
    console.log("PR Review:",PR_Reviews);

    const fileChange = PR_FILES.data.map((item) => item.filename);

    const createclaim = await createClaims(
      user_id,
      Pr_detail.data.title,
      pr_url,
      claim_type,
      description,
      visibility,
    );
    console.log("CLAIMS INTIALS", createclaim);
    const response_PR = await createPR(
      pr_url,
      Pr_detail.data.additions,
      Pr_detail.data.deletions,
      Pr_detail.data.merged_at!,
      Pr_detail.data.body!,
      Pr_detail.data.created_at!,
      Pr_detail.data.updated_at!,
      Pr_detail.data.issue_url!,
      Pr_detail.data.changed_files!,
      fileChange!,
    );
    console.log("CLAIMS CREATED", response_PR);

    return NextResponse.json({ token: getUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
