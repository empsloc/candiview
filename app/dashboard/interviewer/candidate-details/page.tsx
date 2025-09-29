"use client";

import React, { useEffect } from "react";
import { useCandidate } from "@/context/CandidateContext";
import { ArrowLeftFromLine, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

const InterviewDetailsPage = () => {
  const { selectedCandidate } = useCandidate();

  useEffect(() => {
    console.log("Chat history:", selectedCandidate?.chat_history);
  }, [selectedCandidate]);

  const candidate = {
    name: selectedCandidate?.resume_data?.name || "Sarah Miller",
    role: selectedCandidate?.job_name || "Software Engineer",
    profilePic:
      selectedCandidate?.imageUrl ||
      "https://via.placeholder.com/150",
  };

  const formatDate = (date: any) => {
    if (!date) return null;
    try {
      return date instanceof Date
        ? date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return date.toString();
    }
  };

  const interview = {
    postedOnDate:
      selectedCandidate?.posted_on_date?.toString().slice(0, 10) ||
      "2024-07-26",
    interviewer: selectedCandidate?.interviewer || "Swipe Bot",
    type: "Technical Interview",
    stage: "Coding Challenge",
    appliedOnDate:
      selectedCandidate?.applied_on_date?.toString().slice(0, 10) ||
      "2024-07-26",
    status: "Under company review",
  };

  const candidateFeedback =
    selectedCandidate?.chat_history
      ?.reduce((acc: any[], curr: any, index: number, arr: any[]) => {
        if (curr.type === "bot") {
          const answerObj = arr[index + 1];
          acc.push({
            question: curr.question,
            answer: answerObj?.answer || "No answer",
            date: curr.time || interview.postedOnDate,
            reviewer: curr.reviewer || interview.interviewer,
            rating: curr.rating || 5,
            avatar:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"





          });
        }
        return acc;
      }, []) || [];

  const isLoading = !selectedCandidate; // show shimmer when no candidate is selected

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
            <a className="hover:text-primary transition-colors" href="#">
              Candidates
            </a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white">
              {isLoading ? <div className="h-4 w-32 rounded bg-gray-200 animate-pulse inline-block" /> : candidate.name}
            </span>
          </div>

          <div className="bg-white dark:bg-background-dark/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            {/* Candidate Header */}
            <div className="p-6 @container">
              <div className="flex flex-col gap-6 @[520px]:flex-row @[520px]:justify-between @[520px]:items-center">
                <div className="flex items-center gap-4">
                  {isLoading ? (
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  ) : (
                    <div
                      className="w-24 h-24 rounded-full bg-cover bg-center ring-4 ring-white dark:ring-slate-900"
                      style={{ backgroundImage: `url(${candidate.profilePic})` }}
                    />
                  )}
                  <div>
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
                        <p className="text-slate-600 dark:text-slate-300">Applied for {candidate.role}</p>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm tracking-wide hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors w-full @[480px]:w-auto"
                  href="/dashboard/interviewer"
                >
                  <ArrowLeftFromLine className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 px-6">
              <nav className="flex gap-8 -mb-px">
                <a className="py-4 px-1 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200 transition-colors text-sm font-medium" href="#">
                  Interviewee
                </a>
                <a className="py-4 px-1 border-b-2 border-primary text-primary text-sm font-bold" href="#">
                  Interviewer
                </a>
              </nav>
            </div>

            {/* Interview Details */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Interview Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </div>
                    ))
                  : Object.entries(interview).map(([key, value]) => (
                      <div className="space-y-1" key={key}>
                        <p className="text-slate-500 dark:text-slate-400">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{value}</p>
                      </div>
                    ))}
              </div>
            </div>

            {/* Candidate Feedback */}
            <div className="border-t border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Test History</h3>
              <div className="space-y-6">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg animate-pulse h-28" />
                    ))
                  : candidateFeedback.map((fb, index) => (
                      <div key={index} className="bg-gray-100 dark:bg-background-dark p-4 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                            style={{ backgroundImage: `url(${fb.avatar})` }}
                          />
                          <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{fb.reviewer}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{fb.date}</p>
                              </div>
                              <div className="flex items-center gap-0.5 text-primary">
                                {Array(fb.rating).fill(0).map((_, i) => (
                                  <Star key={i} size={10} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-slate-800 dark:text-slate-300 mt-2 leading-relaxed">{fb.question?.trim() || "No question"}</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{fb.answer?.trim() || "No answer"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewDetailsPage;
