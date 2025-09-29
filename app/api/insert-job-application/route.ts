// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { applicationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      jobId,
      email,
      applied_on_date,
      application_status,
      job_name,
      job_description,
      posted_on_date,
      imageUrl,
      resume_raw_data,
      resume_data,
      ai_questions,
      chat_history,
      ai_evaluation,
      ai_score,
    } = data;

    if (!jobId || !email) {
      return NextResponse.json(
        { error: "Missing required fields: jobId or email" },
        { status: 400 }
      );
    }

    // Convert string dates to Date objects if necessary
    const appliedDate = applied_on_date ? new Date(applied_on_date) : new Date();
    const postedDate = posted_on_date ? new Date(posted_on_date) : new Date();

    // Check if application already exists for this user & job
    const existingApp = await db
      .select()
      .from(applicationsTable)
      .where(and(eq(applicationsTable.jobId, jobId), eq(applicationsTable.email, email)));

    if (existingApp.length === 0) {
      // Insert new application
      await db.insert(applicationsTable).values({
        jobId,
        email,
        applied_on_date: appliedDate,
        application_status: application_status || "Under Review",
        job_name,
        job_description,
        posted_on_date: postedDate,
        imageUrl: imageUrl || null,
        resume_raw_data: resume_raw_data || null,
        resume_data: resume_data || null,
        ai_questions: ai_questions || null,
        chat_history: chat_history || null,
        ai_evaluation: ai_evaluation || null,
        ai_score: ai_score || null,
      });

      return NextResponse.json({ message: "Application created!" });
    } else {
      // Update existing application
      await db
        .update(applicationsTable)
        .set({
          applied_on_date: appliedDate || existingApp[0].applied_on_date,
          application_status: application_status || existingApp[0].application_status,
          job_name,
          job_description,
          posted_on_date: postedDate || existingApp[0].posted_on_date,
          imageUrl: imageUrl || existingApp[0].imageUrl,
          resume_raw_data: resume_raw_data || existingApp[0].resume_raw_data,
          resume_data: resume_data || existingApp[0].resume_data,
          ai_questions: ai_questions || existingApp[0].ai_questions,
          chat_history: chat_history || existingApp[0].chat_history,
          ai_evaluation: ai_evaluation || existingApp[0].ai_evaluation,
          ai_score: ai_score || existingApp[0].ai_score,
        })
        .where(and(eq(applicationsTable.jobId, jobId), eq(applicationsTable.email, email)));

      return NextResponse.json({ message: "Application updated!" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
