import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { applicationsTable } from "@/db/schema";

export async function GET(req: NextRequest) {
  try {
    const applications = await db.select().from(applicationsTable);
    return NextResponse.json({ success: true, data: applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
