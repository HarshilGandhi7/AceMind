"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon, DocumentTextIcon, AcademicCapIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function ResumeAnalysisResult() {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!id) {
      router.push("/resumeAnalyse");
      return;
    }

    const storedData = sessionStorage.getItem(`resumeAnalysis_${id}`);

    if (!storedData) {
      router.push("/resumeAnalyse");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData);
      setAnalysisData(parsedData.analysis || parsedData);
    } catch (err) {
      console.error("Invalid resume data format", err);
      router.push("/resumeAnalyse");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-t-2 border-r-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!analysisData) return null;

  const { score, strengths, weaknesses, custom_recommendations, ats_compliance, project_analysis } = analysisData;

  // Extract the numeric value from the score (e.g., "3/10" -> 3)
  const scoreValue = parseInt(score?.split('/')[0]) || 0;
  const scoreMax = parseInt(score?.split('/')[1]) || 10;
  
  // Determine score color based on value
  const getScoreColor = () => {
    if (scoreValue <= 3) return "text-red-500";
    if (scoreValue <= 6) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => router.push('/resumeAnalyse')}
            className="flex items-center text-gray-400 hover:text-white transition"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Analyzer</span>
          </button>
          
          <button 
            onClick={() => window.print()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg flex items-center text-sm transition"
          >
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            <span>Download Report</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Resume Analysis Report
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            AI-powered feedback to optimize your resume
          </p>
        </div>
        
        {/* Score Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mb-10 text-center">
          <h2 className="text-xl font-semibold text-gray-200 mb-3">Resume Score</h2>
          <div className={`text-6xl font-bold ${getScoreColor()}`}>
            {score}
          </div>
          
          {/* Score Bar */}
          <div className="h-4 bg-gray-700/50 rounded-full mt-4 mb-2 overflow-hidden">
            <div 
              className={`h-full ${scoreValue <= 3 ? 'bg-red-500' : scoreValue <= 6 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${(scoreValue / scoreMax) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-gray-400 text-sm italic">
            {scoreValue <= 3 ? (
              'Your resume needs significant improvements to be competitive.'
            ) : scoreValue <= 6 ? (
              'Your resume is average but could be much stronger with targeted changes.'
            ) : (
              'Your resume is strong but there are still some areas for improvement.'
            )}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-2xl border border-green-600/20 p-6 h-full">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">Strengths</h2>
            </div>
            <ul className="space-y-2 pl-5 list-disc text-green-300 marker:text-green-500">
              {strengths?.map((strength: string, idx: number) => (
                <li key={idx}>{strength}</li>
              ))}
            </ul>
          </div>
          
          {/* Weaknesses */}
          <div className="bg-gradient-to-br from-red-900/30 to-rose-900/20 rounded-2xl border border-red-600/20 p-6 h-full">
            <div className="flex items-center mb-4">
              <XCircleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-white">Weaknesses</h2>
            </div>
            
            {/* Content weaknesses */}
            {weaknesses?.content && weaknesses.content.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-red-200 mb-2">Content Issues</h3>
                <ul className="space-y-2 pl-5 list-disc text-red-300 marker:text-red-500">
                  {weaknesses.content.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Formatting weaknesses */}
            {weaknesses?.formatting && weaknesses.formatting.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-red-200 mb-2">Formatting Issues</h3>
                <ul className="space-y-2 pl-5 list-disc text-red-300 marker:text-red-500">
                  {weaknesses.formatting.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Keyword weaknesses */}
            {weaknesses?.keyword_optimization && weaknesses.keyword_optimization.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-red-200 mb-2">Missing Keywords</h3>
                <ul className="space-y-2 pl-5 list-disc text-red-300 marker:text-red-500">
                  {weaknesses.keyword_optimization.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Custom Recommendations */}
        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-2xl border border-blue-600/20 p-6 mb-10">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AcademicCapIcon className="h-6 w-6 text-blue-500 mr-2" />
            <span>Custom Recommendations</span>
          </h2>
          <ul className="space-y-3">
            {custom_recommendations?.map((recommendation: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="bg-blue-900/50 text-blue-300 rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-blue-100">{recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
        
        {/* ATS Compliance */}
        <div className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 rounded-2xl border border-purple-600/20 p-6 mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">ATS Compliance</h2>
          
          {/* Parser Issues */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-purple-200 mb-3 border-b border-purple-800/50 pb-2">Parser Issues</h3>
            <ul className="space-y-2 pl-5 list-disc text-purple-300 marker:text-purple-500">
              {ats_compliance?.parser_issues?.map((issue: string, idx: number) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </div>
          
          {/* Compatibility */}
          <div>
            <h3 className="text-lg font-medium text-purple-200 mb-3 border-b border-purple-800/50 pb-2">Compatibility</h3>
            <ul className="space-y-2 pl-5 list-disc text-purple-300 marker:text-purple-500">
              {ats_compliance?.compatibility?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Project Analysis */}
        {project_analysis && project_analysis.length > 0 && (
          <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 rounded-2xl border border-amber-600/20 p-6 mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">Project Analysis</h2>
            
            <div className="space-y-8">
              {project_analysis.map((project: any, projectIdx: number) => (
                <div key={projectIdx} className="border-t border-amber-800/30 pt-6 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-medium text-amber-200 mb-2">
                    {project.project_name}
                  </h3>
                  <p className="text-amber-100 mb-4">{project.evaluation}</p>
                  
                  <h4 className="text-sm font-medium text-amber-300 uppercase tracking-wider mb-2">Specific Recommendations</h4>
                  <ul className="space-y-2 pl-5 list-disc text-amber-300 marker:text-amber-500">
                    {project.specific_recommendations?.map((rec: string, recIdx: number) => (
                      <li key={recIdx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button 
            onClick={() => router.push('/resumeAnalyse')}
            className="flex-1 max-w-xs mx-auto bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Analyze Another Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
}