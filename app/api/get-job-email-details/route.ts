import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { applicationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");
    const jobId = url.searchParams.get("jobId");

    if (!email) {
      return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
    }

    let applications;

    if (jobId) {
      applications = await db
        .select()
        .from(applicationsTable)
        .where(and(eq(applicationsTable.email, email), eq(applicationsTable.jobId, jobId)));
    } else {
      applications = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.email, email));
    }

    return NextResponse.json(applications);
  } catch (err) {
    console.error("GET /api/applications error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
