"use client";

import { useState } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResumeUploader() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [role, setRole] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile || !role.trim()) {
      setError("Please provide both a file and a role.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("role", role);

    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.text) {
        setText(data.text);
        const analysisResponse = await fetch("/api/analyze-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText: data.text,
            role: role,
          }),
        });
        const analysisData = await analysisResponse.json();
        console.log(analysisData.analysis);
        if (analysisData.analysis) {
          toast.success("Resume parsed successfully!");
          const jsonContent = analysisData.analysis.replace(/```json\n|\n```/g, '');
          const id = Date.now().toString();
          const analysis = JSON.parse(jsonContent);
          sessionStorage.setItem(
            `resumeAnalysis_${id}`,
            JSON.stringify({
              analysis: analysis,
            })
          );
          router.push(`/resumeAnalyse/${id}`);
        }
      } else {
        setError("Error parsing the resume.");
      }
    } catch (err) {
      setError("An error occurred while processing the file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Resume Analyzer
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Upload your resume and get AI-powered feedback to stand out in your
            job search
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left Section */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 p-8 lg:p-12">
              <h2 className="text-3xl font-bold text-white mb-8">
                Unlock the Power of Your Resume
              </h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center mr-5">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      ATS-Optimized
                    </h3>
                    <p className="text-gray-300">
                      Get insights to ensure your resume passes through
                      Applicant Tracking Systems successfully.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center mr-5">
                    <svg
                      className="h-6 w-6 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Smart Analysis
                    </h3>
                    <p className="text-gray-300">
                      Our AI identifies strengths and weaknesses in your resume
                      content, structure, and formatting.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-5">
                    <svg
                      className="h-6 w-6 text-indigo-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Custom Recommendations
                    </h3>
                    <p className="text-gray-300">
                      Receive personalized suggestions tailored to your target
                      role and industry standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="backdrop-blur p-8 lg:p-12">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/10">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Upload Your Resume
                </h3>

                {!fileName && !isLoading && !text && (
                  <div className="border-2 border-dashed border-gray-500/30 hover:border-blue-500/40 transition-colors duration-300 rounded-xl p-8 text-center bg-white/5">
                    <CloudArrowUpIcon className="h-16 w-16 text-blue-400/80 mx-auto mb-4" />
                    <p className="text-gray-200 mb-4">
                      Drag and drop your resume file, or click to browse
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg cursor-pointer transition shadow-lg"
                    >
                      Select File
                    </label>
                    <p className="text-xs text-gray-400 mt-4">
                      Supported formats: PDF, DOCX
                    </p>
                  </div>
                )}

                {/* Role Field */}
                <div className="mt-6">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Target Role
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full px-4 py-3 bg-white/10 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. Software Engineer, Product Manager"
                    />
                    {role && (
                      <span className="absolute right-3 top-3 h-6 w-6 text-green-400">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">
                    This helps us tailor our analysis to your specific career
                    goals
                  </p>
                </div>

                {/* Display selected file */}
                {fileName && !text && !error && (
                  <div className="mt-6 bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-blue-400 mr-3" />
                    <div>
                      <p className="text-gray-200">Selected file:</p>
                      <p className="text-sm font-medium text-blue-300">
                        {fileName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Process Button */}
                {fileName && !text && !isLoading && !error && (
                  <button
                    onClick={handleUpload}
                    className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg transition shadow-lg font-medium"
                  >
                    <span>Analyze Resume</span>
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                )}

                {/* Loading state */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-200 animate-pulse">
                      Analyzing your resume...
                    </p>
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="bg-red-900/30 rounded-lg p-4 mt-6 flex items-start border border-red-500/30">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-300">
                        An error occurred
                      </h4>
                      <p className="mt-1 text-sm text-red-200">{error}</p>
                      <button
                        className="mt-3 text-xs text-white bg-red-800/50 hover:bg-red-800/70 px-3 py-1.5 rounded-md"
                        onClick={() => setError(null)}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                )}

                {/* Display extracted text */}
                {text && !isLoading && !error && (
                  <div className="mt-6 space-y-6">
                    <div className="bg-white/5 rounded-xl p-5 border border-gray-700">
                      <h3 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">
                        Extracted Content
                      </h3>
                      <div className="bg-black/30 rounded-lg p-4 text-sm text-gray-300 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        <pre className="whitespace-pre-wrap font-sans">
                          {text}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
