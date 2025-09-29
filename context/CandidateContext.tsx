"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Candidate = {
  id: number;
  email: string;
  jobId?: string;
  job_name?: string;
  job_description?: string;
  posted_on_date?: string;
  applied_on_date?: string;
  application_status?: string;
  imageUrl?: string | null;
  resume_raw_data?: string;
  resume_data?: any;
  ai_questions?: any[];
  chat_history?: any[];
  ai_evaluation?: string;
  ai_score?: number;
  [key: string]: any; // dynamic fields
};

type CandidateContextType = {
  selectedCandidate: Candidate | null;
  setSelectedCandidate: (candidate: Candidate) => void;
  updateCandidateField: (updates: Partial<Candidate>) => void;
};

export const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [selectedCandidate, setSelectedCandidateState] = useState<Candidate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("selectedCandidate");
    if (stored) setSelectedCandidateState(JSON.parse(stored));
  }, []);

  const setSelectedCandidate = (candidate: Candidate) => {
    setSelectedCandidateState(candidate);
    localStorage.setItem("selectedCandidate", JSON.stringify(candidate));
  };

  const updateCandidateField = (updates: Partial<Candidate>) => {
    setSelectedCandidateState((prev:any) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("selectedCandidate", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CandidateContext.Provider value={{ selectedCandidate, setSelectedCandidate, updateCandidateField }}>
      {children}
    </CandidateContext.Provider>
  );
};

export function useCandidate() {
  const context = useContext(CandidateContext);
  if (!context) throw new Error("useCandidate must be used within CandidateProvider");
  return context;
}
