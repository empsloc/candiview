// app/api/applications/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { applicationsTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
export async function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const email = url.searchParams.get("email");
  
      if (!email) {
        return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
      }
  
      const userApplications = await db
        .select()
        .from(applicationsTable)
        .where(eq(applicationsTable.email, email));
  
      return NextResponse.json(userApplications);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
  }