"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Resume data type
export type ResumeData = {
  name?: string;
  email?: string;
  phone?: string;
  education?: any[];
  experience?: any[];
  achievement?: any[];
  certification?: any[];
  projects?: any[];
  skills?: any[];
};

// Question item type
export type QuestionItem = {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  time_alloted: number; // in seconds
  answer?: string;
};

// Chat history type
export type ChatHistoryItem =
  | {
      type: "bot";
      question: string;
      difficulty: "easy" | "medium" | "hard";
      time: number;
    }
  | {
      type: "user";
      answer: string;
    };

// Application state type
export type ApplicationState = {
  id?: number;
  jobId?: string;
  email?: string;
  applied_on_date?: string;
  application_status?: string;
  job_name?: string;
  job_description?: string;
  posted_on_date?: string;
  imageUrl?: string | null;
  resume_raw_data?: string;
  resume_data?: ResumeData;
  ai_questions?: QuestionItem[]; // <-- updated to array
  chat_history?: ChatHistoryItem[];
  ai_evaluation?: string;
  ai_score?: number;
};

// Context type
type ApplicationContextType = {
  application: ApplicationState;
  setApplication: React.Dispatch<React.SetStateAction<ApplicationState>>;
};

// Create context
const ApplicationContext = createContext<ApplicationContextType | undefined>(
  undefined
);

// Provider component
export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [application, setApplication] = useState<ApplicationState>({});

  // Load from localStorage on mount
  useEffect(() => {
    const storedApp = localStorage.getItem("application");
    if (storedApp) {
      setApplication(JSON.parse(storedApp));
    }
  }, []);

  // Save to localStorage whenever application changes
  useEffect(() => {
    localStorage.setItem("application", JSON.stringify(application));
  }, [application]);

  // Helper to transform API ai_questions object to array
  const setAIQuestions = (aiQuestionsObj: Record<string, any>) => {
    const questionsArray: QuestionItem[] = Object.values(aiQuestionsObj).map(
      (q: any) => ({
        question: q.question,
        difficulty: q.difficulty,
        time_alloted: Number(q.time_alloted),
        answer: "",
      })
    );

    setApplication((prev) => ({ ...prev, ai_questions: questionsArray }));
  };

  return (
    <ApplicationContext.Provider value={{ application, setApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
};

// Custom hook
export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error(
      "useApplications must be used within an ApplicationProvider"
    );
  }
  return context;
};
