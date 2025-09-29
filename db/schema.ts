// db/schema.ts
import { integer, pgTable, varchar, timestamp, json, numeric } from "drizzle-orm/pg-core";

// Users table (existing)
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerkId: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  imageUrl: varchar({ length: 500 }),
});

// Applications table (updated to match context)
export const applicationsTable = pgTable("applications", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  jobId: varchar({ length: 100 }).notNull(), // job ID
  email: varchar({ length: 255 }).notNull(), // applicant email
  applied_on_date: timestamp().notNull(), // date of application
  application_status: varchar({ length: 100 }).notNull(), // e.g., "Under Review", "Completed"
  job_name: varchar({ length: 255 }).notNull(), // job title
  job_description: varchar({ length: 2000 }).notNull(), // job description
  posted_on_date: timestamp().notNull(), // job posting date
  imageUrl: varchar({ length: 500 }), // optional image URL for the job/application

  resume_raw_data: varchar({ length: 5000 }), // raw resume text
  resume_data: json(), // structured resume info
  ai_questions: json(), // AI-generated questions array [{question,difficulty,time_alloted,answer},...]
  chat_history: json(), // chat Q&A array [{type:'bot'|'user', question?, difficulty?, time?, answer?},...]

  ai_evaluation: varchar({ length: 2000 }), // AI evaluation text
  ai_score: numeric(), // AI score out of 100
});
