"use client";

import { Bot } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useApplications,
  QuestionItem,
  ChatHistoryItem,
} from "@/context/ApplicationContext";
import { useUser } from "@clerk/nextjs";

export default function TestPage() {
  const { application, setApplication } = useApplications();
  const questions: QuestionItem[] = application.ai_questions || [];
  const [loadingFinish, setLoadingFinish] = useState(false); // ✅ loader state
  const totalQuestions = questions.length;
  const {user} = useUser()

  const router = useRouter();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // State
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const currentQuestion = questions[currentIndex];
  const isTestCompleted = currentIndex >= totalQuestions;

  // Restore progress from application on mount
  useEffect(() => {
    if (application.chat_history) {
      setChatHistory(application.chat_history);
      const lastUserIndex = application.chat_history.filter(
        (item) => item.type === "user"
      ).length;
      setCurrentIndex(lastUserIndex);
    }
  }, [application.chat_history]);

  // Timer logic
  useEffect(() => {
    if (!currentQuestion || isTestCompleted) return;

    setTimeLeft(currentQuestion.time_alloted);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion("No response submitted");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, currentQuestion]);

  const handleNextQuestion = (userAnswer: string) => {
    if (!currentQuestion) return;
  
    const newChatItems: ChatHistoryItem[] = [
      ...chatHistory,
      {
        type: "bot" as const,
        question: currentQuestion.question,
        difficulty: currentQuestion.difficulty,
        time: currentQuestion.time_alloted,
      },
      ...(userAnswer
        ? [
            {
              type: "user" as const,
              answer: userAnswer,
            },
          ]
        : []),
    ];
  
    setChatHistory(newChatItems);
    setAnswer("");
  
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(totalQuestions);
    }
  
    // ✅ Defer context update to avoid "update during render" error
    setTimeout(() => {
      setApplication((prev) => ({ ...prev, chat_history: newChatItems }));
    }, 0);
  };
  

  const handleFinish = async () => {
    setLoadingFinish(true); // ✅ start loader
    try {
      if (
        !application.job_name ||
        !application.job_description ||
        !application.resume_raw_data ||
        !application.email
      ) {
        console.error("Missing job info, resume data, or email");
        router.push("/dashboard/assessment/result");
        return;
      }
  
      // Call AI evaluation API
      const aiResponse = await fetch("/api/evaluate-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_name: application.job_name,
          job_description: application.job_description,
          resume_raw_data: application.resume_raw_data,
          chat_history: chatHistory,
        }),
      });
  
      const aiResult = await aiResponse.json();
  
      const updatedApplication = {
        ...application,
        chat_history: chatHistory,
        ai_evaluation: aiResult?.data?.ai_evaluation || "",
        ai_score: aiResult?.data?.ai_score || null,
        imageUrl: user?.imageUrl , // ✅ explicitly re-attach Clerk image
      };
  
      // Update context
      setApplication(updatedApplication);
  
      // Insert application into database via Drizzle API
      const dbResponse = await fetch("/api/insert-job-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedApplication),
      });
  
      const dbResult = await dbResponse.json();
      if (!dbResponse.ok) {
        console.error("Failed to save application:", dbResult);
      }
  
      // Redirect to result page
      router.push("/dashboard/assessment/result");
    } catch (err) {
      console.error("Error finishing test:", err);
      router.push("/dashboard/assessment/result");
    } finally {
      setLoadingFinish(false); // ✅ stop loader
    }
  };
  
  
  

  // Auto-scroll to bottom when chatHistory updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      {/* Header */}
      <header className="bg-background-light dark:bg-background-dark/50 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Interview Test
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined">timer</span>
                <span className="font-mono text-lg font-semibold">
                  {Math.floor(timeLeft / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col pt-8">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
          <div className="bg-white dark:bg-background-dark/50 rounded-xl shadow-lg flex flex-col h-full">
            {/* Progress */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  AI Evaluation
                </h2>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${(Math.min(currentIndex, totalQuestions) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Chat Section */}
            <div
              ref={chatContainerRef}
              className="flex-grow p-6 hide-scrollbar space-y-4 overflow-y-auto min-h-[450px] sm:min-h-[300px] lg:min-h-[430px]"
              style={{ maxHeight: "450px" }} // fixed height
            >
              {chatHistory.map((item, idx) =>
                item.type === "bot" ? (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="text-primary" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-lg">
                      <p>{item.question}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span
                          className={`text-sm font-semibold px-2 py-0.5 rounded ${
                            item.difficulty === "easy"
                              ? "text-green-700 dark:text-green-400 bg-green-200 dark:bg-green-700/30"
                              : item.difficulty === "medium"
                              ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/20"
                              : "text-red-600 dark:text-red-400 bg-red-500/20"
                          }`}
                        >
                          {item.difficulty.charAt(0).toUpperCase() +
                            item.difficulty.slice(1)}{" "}
                          Difficulty
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={idx} className="flex items-start gap-3 justify-end">
                    <div className="bg-primary text-white rounded-lg p-4 max-w-lg">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )
              )}

              {/* Current question */}
              {!isTestCompleted && currentQuestion &&
                (chatHistory.length === 0 ||
                  chatHistory[chatHistory.length - 1].type === "user") && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="text-primary" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-w-lg">
                      <p>{currentQuestion.question}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span
                          className={`text-sm font-semibold px-2 py-0.5 rounded ${
                            currentQuestion.difficulty === "easy"
                              ? "text-green-700 dark:text-green-400 bg-green-200 dark:bg-green-700/30"
                              : currentQuestion.difficulty === "medium"
                              ? "text-yellow-600 dark:text-yellow-400 bg-yellow-500/20"
                              : "text-red-600 dark:text-red-400 bg-red-500/20"
                          }`}
                        >
                          {currentQuestion.difficulty.charAt(0).toUpperCase() +
                            currentQuestion.difficulty.slice(1)}{" "}
                          Difficulty
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-sm">
                            timer
                          </span>
                          <span>
                            {Math.floor(timeLeft / 60)
                              .toString()
                              .padStart(2, "0")}
                            :{(timeLeft % 60).toString().padStart(2, "0")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {isTestCompleted && (
                <div className="text-center text-gray-500 dark:text-gray-400 font-semibold">
                  You have completed the test. Click Finish to see your score.
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-background-dark/50 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <textarea
                  className="w-full p-3 border-gray-300 dark:border-gray-700 bg-background-light dark:bg-gray-800 rounded-lg focus:ring-primary focus:border-primary placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                  placeholder={isTestCompleted ? "Test completed" : "Type your answer here..."}
                  rows={1}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isTestCompleted}
                />
                <button
                  type="button"
                  onClick={isTestCompleted ? handleFinish : () => handleNextQuestion(answer.trim())}
                  className="inline-flex justify-center items-center py-3 px-5 text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                  disabled={!answer.trim() && !isTestCompleted}
                >
                  {isTestCompleted && loadingFinish ? (
                    <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined">{isTestCompleted ? "Finish" : "Send"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
