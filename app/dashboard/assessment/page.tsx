"use client";

import { Check, Rocket, Timer, Wifi } from "lucide-react";
import React, { useState } from "react";
import { useApplications, QuestionItem } from "@/context/ApplicationContext";
import { useRouter } from "next/navigation";

export default function StartTestPage() {
  const { application, setApplication } = useApplications();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartTest = async () => {
    if (!application.job_name || !application.job_description || !application.resume_raw_data) {
      alert("Missing necessary data to start test.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobName: application.job_name,
          jobDescription: application.job_description,
          resume_raw_data: application.resume_raw_data,
        }),
      });

      const data = await res.json();

      if (res.ok && data?.data) {
        // Transform AI questions object into array
        const questionsArray: QuestionItem[] = Object.values(data.data).map((q: any) => ({
          question: q.question,
          difficulty: q.difficulty,
          time_alloted: Number(q.time_alloted),
          answer: "", // default empty
        }));

        setApplication({
          ...application,
          ai_questions: questionsArray,
        });

        // Redirect to test page after successful generation
        router.push("/dashboard/assessment/test");
      } else {
        console.error("API error:", data);
        alert("Could not generate questions. Check console.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-body text-slate-700 dark:text-slate-300">
      <main className="flex-grow  md:ml-24 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="bg-white dark:bg-slate-900 shadow-card dark:shadow-card-dark rounded-xl p-8 md:p-12 border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
                {application.job_name} skills Test
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Ready to showcase your expertise? Follow the instructions below.
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold font-display text-slate-800 dark:text-slate-100 mb-4">
                  Instructions
                </h3>
                <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                  <li className="flex items-start">
                    <span className="material-symbols-outlined text-primary-500 mr-3 mt-1">
                      <Check />
                    </span>
                    <span>
                      This is an AI-powered assessment with multiple-choice questions
                      and coding challenges.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-symbols-outlined text-primary-500 mr-3 mt-1">
                      <Wifi />
                    </span>
                    <span>
                      Ensure you have a stable internet connection and a quiet environment.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="material-symbols-outlined text-primary-500 mr-3 mt-1">
                      <Timer />
                    </span>
                    <span>
                      You have <strong>60 minutes</strong> to complete the test. The timer
                      starts immediately and cannot be paused.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Timer */}
              <div>
                <h3 className="text-xl text-center font-bold font-display text-slate-800 dark:text-slate-100 mb-4">
                  Time Allotment
                </h3>
                <div className="flex justify-center space-x-4 text-center">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 w-28 shadow-sm">
                    <div className="text-5xl font-extrabold text-primary-600 dark:text-primary-500 font-display">
                      60
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                      Minutes
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleStartTest}
                disabled={loading}
                className={`w-full max-w-xs inline-flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 transform hover:scale-105 transition-all duration-300`}
              >
                <span className="material-symbols-outlined mr-2">
                  <Rocket />
                </span>
                {loading ? "Generating..." : "Start Test Now"}
              </button>
              <p className="mt-6 text-sm text-center text-slate-500 dark:text-slate-400">
                Good luck! We're excited to see your skills in action.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
