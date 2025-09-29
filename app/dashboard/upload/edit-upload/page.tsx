"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/context/ApplicationContext"; 
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

function EditUploadPage() {
  const { application, setApplication } = useApplications();
  const router = useRouter();
  const resumeData = application.resume_data || {};
  const  {user} = useUser();

  // Local state for inputs
  const [formData, setFormData] = useState({
    name: resumeData.name || "",
    email: resumeData.email || "",
    phone: resumeData.phone || "",
  });

  // Update local state if context changes (e.g., on reload)
 // Update local state if context changes (e.g., on reload)
useEffect(() => {
  if (!resumeData) return;

  setFormData({
    name: resumeData.name || "",
    email: resumeData.email || "",
    phone: resumeData.phone || "",
  });
}, [resumeData?.name, resumeData?.email, resumeData?.phone]);


  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 border-b border-subtle-light dark:border-subtle-dark">
            <nav
              aria-label="Tabs"
              className="-mb-px flex space-x-8 text-sm font-medium"
            >
              <a
                className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-semibold"
                href="#"
              >
                Candidate
              </a>
              <a
                className="border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium"
                href="#"
              >
                Interviewer
              </a>
            </nav>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Candidate Info */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-soft">
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-5">
                  Your Information
                </h2>
                <div className="space-y-4">
                  {/* Resume Subsection */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2"
                      htmlFor="resume-upload"
                    >
                      Resume
                    </label>
                    <div className="mt-1 flex items-center gap-4 p-4 border-2 border-subtle-light dark:border-subtle-dark border-dashed rounded-lg">
                      <div className="flex-shrink-0">
                        <File className="text-4xl text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                        <label className="relative cursor-pointer font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary rounded-md">
                          <span>{application.resume_raw_data ? `${user?.emailAddresses}` : "No file uploaded"}</span>
                        </label>
                        {application.resume_raw_data && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                            resume that you uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Editable Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="name">
                      Name
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Editable Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="email">
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Editable Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400" htmlFor="phone">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Continue Button */}
                  <div className="mt-6">
                    <Button
                      className="w-full"
                      variant="default"
                      onClick={() => {
                        setApplication({
                          ...application,
                          resume_data: {
                            ...resumeData,
                            name: formData.name || resumeData.name || "",
                            email: formData.email || resumeData.email || "",
                            phone: formData.phone || resumeData.phone || "",
                          },
                        });
                        console.log(application)
                        router.push("/dashboard/assessment");
                        
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Extracted Info */}
            <div className="bg-white dark:bg-card-dark rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                Resume Extracted Information
              </h2>

              {/* ...rest of extracted info (education, experience, etc.) stays the same */}
              <div className="space-y-6">
                {/* Education */}
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2">
                    Education
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumeData.education?.length
                      ? resumeData.education.map((edu: any, idx: number) => (
                          <li key={idx}>
                            {edu.degree} – {edu.institution} ({edu.start_date} -{" "}
                            {edu.end_date})
                          </li>
                        ))
                      : <li>No education info</li>}
                  </ul>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2">
                    Experience
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumeData.experience?.length
                      ? resumeData.experience.map((exp: any, idx: number) => (
                          <li key={idx}>
                            {exp.role} – {exp.company} ({exp.start_date} -{" "}
                            {exp.end_date})
                          </li>
                        ))
                      : <li>No experience info</li>}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2">
                    Achievements
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumeData.achievement?.length
                      ? resumeData.achievement.map((ach: string, idx: number) => (
                          <li key={idx}>{ach}</li>
                        ))
                      : <li>No achievements info</li>}
                  </ul>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-md font-semibold text-primary mb-2">
                    Certifications
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {resumeData.certification?.length
                      ? resumeData.certification.map((cert: string, idx: number) => (
                          <li key={idx}>{cert}</li>
                        ))
                      : <li>No certifications info</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditUploadPage;
