"use client";
import React, { useState, useRef } from "react";
import pdfToText from "react-pdftotext";
import { useRouter } from "next/navigation";
import { useApplications } from "@/context/ApplicationContext";
import { useUser } from "@clerk/nextjs";

export default function ResumeUpload() {
  const [error, setError] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setApplication } = useApplications();
  const { user } = useUser();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setRawText("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError(true);
      setFileName(null);
      return;
    }

    setFileName(file.name);

    try {
      setLoading(true);
      const text = await pdfToText(file);
      setRawText(text);
    } catch (err) {
      console.error("Text extraction failed", err);
      setError(true);
      setFileName(null);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!rawText) return;

    try {
      setLoading(true);
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });
      const data = await res.json();

      if (data?.data) {
        setApplication((prev) => ({
          ...prev,
          resume_raw_data: rawText,
          resume_data: data.data,
          user_email: user?.primaryEmailAddress?.emailAddress || null,
          user_image: user?.imageUrl || null,
        }));
      }

      router.push("/dashboard/upload/edit-upload");
    } catch (err) {
      console.error("Failed to call AI API:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <main className="flex flex-grow items-center -mt-72 md:ml-24 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-background-dark/50 shadow-lg rounded-xl p-8 space-y-6 flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Upload Resume
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please upload your resume to continue.
              </p>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-full ${
                error
                  ? "border-red-500 dark:border-red-500/70 bg-red-50 dark:bg-red-900/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary"
              }`}
              onDragOver={(e) => e.preventDefault()}
            >
              {!error ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {fileName
                      ? `Selected File: ${fileName}`
                      : "Drag & drop your file here"}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">or</p>
                  <label
                    className="bg-primary text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-primary/90 transition-colors"
                    htmlFor="file-upload"
                  >
                    Browse Files
                  </label>
                  <input
                    ref={fileInputRef}
                    className="sr-only"
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                  />

                  {fileName && (
                    <button
                      onClick={handleContinue}
                      className="mt-2 bg-blue-200 font-bold py-2 px-4 text-blue-600 rounded hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Continue"
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <p className="text-lg font-semibold text-red-700 dark:text-red-400">
                    Invalid File Type
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400/80">
                    Please upload a PDF file.
                  </p>
                  <button
                    onClick={() => {
                      setError(false);
                      setFileName(null);
                      setRawText("");
                      fileInputRef.current!.value = "";
                    }}
                    className="mt-2 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                PDF up to 10MB
              </p>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              By uploading your resume, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
