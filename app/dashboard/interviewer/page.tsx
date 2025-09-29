"use client";

import React, { useEffect, useState } from "react";
import { ArrowDown, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCandidate } from "@/context/CandidateContext";

type Application = {
  id: number;
  email: string;
  phone?: string;
  ai_score?: number;
  ai_evaluation?: string;
  application_status?: string;
  imageUrl?: string | null;
  job_name?: string;
  chat_history?: { question: string; answer: string }[];
  resume_data?: { name: string; phone: string };
};

export default function InterviewerPage() {
  const { setSelectedCandidate } = useCandidate();
  const [applications, setApplications] = useState<Application[] | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("All");
  const [jobNames, setJobNames] = useState<string[]>([]);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/get-applications");
        const data = await res.json();
        if (data.success) {
          setApplications(data.data);
          setSelectedApp(data.data[0] || null);

          const jobs = Array.from(
            new Set(data.data.map((app: Application) => app.job_name).filter(Boolean))
          ) as string[];
          setJobNames(jobs);
        }
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    }
    fetchApplications();
  }, []);

  const handleCandidateClick = (app: Application) => {
    setLoadingCandidate(true);
    setSelectedCandidate({ ...app });
    setTimeout(() => {
      router.push("/dashboard/interviewer/candidate-details");
    }, 200);
  };

  const filteredApps =
    selectedJob === "All" || !applications
      ? applications
      : applications.filter((app) => app.job_name === selectedJob);

  return (
    <div className="flex flex-col lg:flex-row w-full bg-background-light dark:bg-background-dark font-display p-4 lg:p-6 gap-6">
      {/* Candidates Table */}
      <div className="flex-1 flex flex-col gap-6 bg-white dark:bg-background-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border-b border-black/5 dark:border-white/5 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">Candidates</h1>
            <p className="text-sm text-black/60 dark:text-white/60">
              Manage your candidates and their interviews.
            </p>
          </div>

          {/* Job Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={selectedJob}
              onChange={(e) => {
                setSelectedJob(e.target.value);
                const firstApp = applications?.find(
                  (app) => e.target.value === "All" || app.job_name === e.target.value
                );
                setSelectedApp(firstApp || null);
              }}
              className="appearance-none w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-4 text-gray-500 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <option value="All">All Jobs</option>
              {jobNames.map((job, idx) => (
                <option key={idx} value={job}>{job}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <ArrowDown />
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left min-w-[700px] sm:min-w-full">
            <thead className="border-b border-black/5 dark:border-white/5">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-black/60 dark:text-white/60">Name</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-black/60 dark:text-white/60">Email</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-black/60 dark:text-white/60">Phone</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-black/60 dark:text-white/60 text-center">Score</th>
                <th className="px-4 sm:px-6 py-3 text-sm font-medium text-black/60 dark:text-white/60">AI Summary</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps ? (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleCandidateClick(app)}
                    className="hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer border-b border-black/5 dark:border-white/5 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium text-black dark:text-white">{app.resume_data?.name || "Unknown"}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-black/60 dark:text-white/60">{app.email}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-black/60 dark:text-white/60">{app.resume_data?.phone || "(N/A)"}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-black/60 dark:text-white/60 text-center">{app.ai_score ?? "N/A"}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-black/60 dark:text-white/60 truncate max-w-xs">{app.ai_evaluation ?? "Not evaluated"}</td>
                  </tr>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-black/5 dark:border-white/5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <td key={i} className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-6">
        {loadingCandidate ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto"></div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="space-y-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : selectedApp ? (
          <>
            {/* Candidate Profile */}
            <div className="flex flex-col items-center p-4 sm:p-6 bg-white dark:bg-background-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-32 h-32 mb-4"
                style={{ backgroundImage: `url("${selectedApp.imageUrl || "https://via.placeholder.com/150"}")` }}
              ></div>
              <h2 className="text-xl font-bold text-black dark:text-white">{selectedApp.resume_data?.name || "Unknown"}</h2>
              <p className="text-sm text-black/60 dark:text-white/60">{selectedApp.job_name || "Candidate"}</p>
              <div className="w-full grid grid-cols-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5 gap-2">
                <p className="text-sm font-medium text-black/60 dark:text-white/60">Email</p>
                <p className="text-sm text-black dark:text-white text-right -ml-5">{selectedApp.email}</p>
                <p className="text-sm font-medium text-black/60 dark:text-white/60">Phone</p>
                <p className="text-sm text-black dark:text-white text-right">{selectedApp.resume_data?.phone || "(N/A)"}</p>
                <p className="text-sm font-medium text-black/60 dark:text-white/60">Score</p>
                <p className="text-sm text-black dark:text-white text-right">{selectedApp.ai_score ?? "N/A"}</p>
                <p className="text-sm font-medium text-black/60 dark:text-white/60 col-span-2">AI Summary</p>
                <p className="text-sm text-black dark:text-white col-span-2">{selectedApp.ai_evaluation ?? "Not evaluated"}</p>
              </div>
            </div>

            {/* Q&A History */}
            <div className="flex flex-col p-4 sm:p-6 bg-white dark:bg-background-dark rounded-xl shadow-sm border border-black/5 dark:border-white/5">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Q&amp;A History</h3>
              <div className="space-y-4">
                {selectedApp.chat_history?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                      <HelpCircle />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">{item.question}</p>
                      <p className="text-sm text-black/60 dark:text-white/60 mt-1">{item.answer}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-primary"></div>
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white"></p>
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1">Click on the table rows to view more</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto"></div>
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="space-y-2 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
