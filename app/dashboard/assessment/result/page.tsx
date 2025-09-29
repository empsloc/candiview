"use client";
import { useApplications } from "@/context/ApplicationContext";
import Link from "next/link";

export default function ResultPage() {
  const { application } = useApplications();

  return (
    <div className="bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Interview Results
          </h2>
          <p className="text-muted-light dark:text-muted-dark mt-1">
            Candidate: {application?.email || "N/A"}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
            {/* Thumbnail */}
            {/* Thumbnail */} <div className="md:col-span-2"> <div className="aspect-video rounded-lg overflow-hidden"> <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASTNHCimW16o-oWXzmE3LNpYHr_j-XYA6PCquQ1vASSBRDxu8WdqQsiLQLM10g5IeEIiEZNqXWpTpXRwgxPPczh4VVQ5EnGZQ2CCqoGy6rYbCzXpe9qmZ0CHLg4R0dFJ3yR2tj3rC934_iE967XX4w9F6rqOEuW-PSQ7Ucn5apUnOuWDtAictO6wY1dA_PnZWMUEP4V_8ljabHNpzeSrYsiWqT1dLuZF1BKN-KtaKXAwrPidlxg63GK7Yi3hZJu9mvs2_eqvhuoNGa" alt="Candidate Video Thumbnail" className="object-cover w-full h-full" /> </div> </div>

            {/* Score + Feedback */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-bold">Overall Score:</p>
                <p className="text-2xl font-bold text-primary">
                  {application?.ai_score
                    ? `${application.ai_score}/100`
                    : "Not Available"}
                </p>
              </div>
              <p className="mt-2 text-muted-light dark:text-muted-dark">
                {application?.ai_evaluation ||
                  "Evaluation report not generated yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses (static for now, can also come from context if you store them) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Thanks for taking the test</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500">✔</span>
                </div>
                <p>Answered all questions</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500">✔</span>
                </div>
                <p>Submitted to Swipe Recruitment team</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500">✔</span>
                </div>
                <p>You Will be notified about further steps</p>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-4">Compliance</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-500">✘</span>
                </div>
                <p>This is an AI generated evaluation</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
                  <span className="text-red-500">✘</span>
                </div>
                <p>Final decision will be made by recruitment team</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Button */}
        <div className="mt-12 flex justify-end">
          <Link href={"/dashboard"} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark">
            Back to Interviews
          </Link>
        </div>
      </div>
    </div>
  );
}
