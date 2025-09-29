"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "@/context/ApplicationContext";
import { useUser } from "@clerk/nextjs";
import { BriefcaseBusiness } from "lucide-react";

function Dashboard() {
  const router = useRouter();
  const { setApplication } = useApplications();
  const { user } = useUser();

  const [jobs, setJobs] = useState<typeof initialJobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [cardLoadingId, setCardLoadingId] = useState<string | null>(null); // <-- new

  const initialJobs = [
    {
      jobId: "J101",
      job_name: "Software Engineer",
      job_description: "Work on building scalable web applications.",
      posted_on_date: "2025-9-01",
      next_step: "HR Interview",
      next_step_date: "2025-10-25",
      application_status: "Not Applied",
    },
    {
      jobId: "J102",
      job_name: "Frontend Developer",
      job_description: "Focus on UI/UX and build reusable React components.",
      posted_on_date: "2025-9-20",
      next_step: "Technical Interview",
      next_step_date: "2025-10-28",
      application_status: "Not Applied",
    },
    {
      jobId: "J103",
      job_name: "Data Analyst",
      job_description: "Analyze datasets and create insights using BI tools.",
      posted_on_date: "2025-9-15",
      next_step: "Online Assessment",
      next_step_date: "2025-10-30",
      application_status: "Not Applied",
    },
  ];

  useEffect(() => {
    if (!user?.emailAddresses[0]?.emailAddress) return;

    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/get-all-job-status?email=${user.emailAddresses[0].emailAddress}`
        );
        const applications = await res.json();

        const updatedJobs = initialJobs.map((job) => {
          const app = applications.find((a: any) => a.jobId === job.jobId);
          if (app?.ai_score !== null && app?.ai_score !== undefined) {
            return { ...job, application_status: "Under Review" };
          }
          return {
            ...job,
            application_status: app ? "Under Review" : "Not Applied",
          };
        });

        setJobs(updatedJobs);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleCardClick = async (job: (typeof initialJobs)[0]) => {
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) return;

    setCardLoadingId(job.jobId); // <-- show loading

    try {
      const res = await fetch(
        `/api/get-job-email-details?email=${email}&jobId=${job.jobId}`
      );
      const existingApp = await res.json();

      if (res.ok && existingApp && existingApp.length > 0) {
        const app = existingApp[0];
        setApplication(app);
        if (app.ai_score !== null && app.ai_score !== undefined) {
          router.push(`/dashboard/assessment/result`);
          return;
        }
      } else {
        setApplication({
          jobId: job.jobId,
          job_name: job.job_name,
          job_description: job.job_description,
          application_status: "Not Applied",
          applied_on_date: new Date().toISOString(),
          posted_on_date: job.posted_on_date,
          email,
          resume_raw_data: undefined,
          resume_data: undefined,
          ai_questions: [],
          chat_history: [],
          ai_evaluation: undefined,
          ai_score: undefined,
        });
      }

      router.push(`/dashboard/upload/`);
    } catch (err) {
      console.error("Error fetching application:", err);
    } finally {
      setCardLoadingId(null); // <-- hide loading
    }
  };

  const shimmerCard = (
    <div className="animate-pulse cursor-default bg-white dark:bg-card-dark rounded-xl shadow-md flex flex-col md:flex-row items-center gap-8 p-8 mb-6">
      <div className="w-40 h-40 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
      <div className="flex-grow space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      </div>
      <div className="self-stretch flex flex-col justify-center items-center md:items-end space-y-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <main className="flex-grow bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark transition-colors duration-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-text-light dark:text-text-dark tracking-tight">
              Candidate Dashboard
            </h2>
            <p className="mt-2 text-lg text-subtext-light dark:text-subtext-dark">
              Welcome back! Here's a summary of your application status and test
              history.
            </p>
          </div>

          <div className="lg:col-span-3 mb-8">
            <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-4">
              Application Status
            </h3>

            {loading
              ? [1, 2, 3].map((i) => (
                  <React.Fragment key={i}>{shimmerCard}</React.Fragment>
                ))
              : jobs?.map((job) => (
                  <div
                    key={job.jobId}
                    onClick={() => handleCardClick(job)}
                    className="cursor-pointer bg-white dark:bg-card-dark rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row items-center gap-8 p-8 mb-6 relative"
                  >
                    {/* Loading overlay */}
                    {cardLoadingId === job.jobId && (
                      <div className="absolute inset-0 bg-white/70 dark:bg-black/40 flex items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                      </div>
                    )}

                    <div className="flex-shrink-0">
                      <div className="w-40 h-40 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <BriefcaseBusiness size={50} className="text-gray-400"/>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <p className="text-sm text-subtext-light dark:text-subtext-dark">
                        Application ID: {job.jobId}
                      </p>
                      <p className="text-2xl font-bold text-text-light dark:text-text-dark mt-1">
                        {job.job_name}
                      </p>
                      <p className="mt-2 text-subtext-light dark:text-subtext-dark">
                        Posted on: {job.posted_on_date}
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {job.job_description}
                      </p>
                      <div className="flex items-center mt-1 gap-2">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                            job.application_status === "Not Applied"
                              ? "bg-gray-200 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400"
                              : "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              job.application_status === "Not Applied"
                                ? "bg-gray-400"
                                : "bg-green-500"
                            }`}
                          ></span>
                          {job.application_status}
                        </span>
                      </div>
                    </div>

                    <div className="self-stretch flex flex-col justify-center items-center md:items-end">
                      <p className="font-semibold text-subtext-light dark:text-subtext-dark">
                        Next Step
                      </p>
                      <p className="text-lg font-bold text-text-light dark:text-text-dark">
                        {job.next_step}
                      </p>
                      <p className="text-sm text-subtext-light dark:text-subtext-dark">
                        Scheduled for {job.next_step_date}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
