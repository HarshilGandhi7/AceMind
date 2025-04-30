import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "../component/InterviewCard";
import {
  getAllInterviews,
  getYourInterviewData,
} from "@/lib/actions/general.actions";

const Page = async () => {
  const YourinterviewData = await getYourInterviewData();
  const allInterviewData = await getAllInterviews();

  return (
    <>
      <section className="card-cta relative">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-4xl font-bold">AI-Powered Career Preparation</h2>
          <p className="text-lg text-gray-500">
            Level up your job search with interview practice and resume
            optimization
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button asChild className="btn-primary flex-1">
              <Link
                href="/interview"
                className="flex items-center justify-center gap-2"
              >
                <span>Practice Interview</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </Button>

            <Button asChild className="btn-secondary flex-1">
              <Link
                href="/resumeAnalyse"
                className="flex items-center justify-center gap-2"
              >
                <span>Analyze Resume</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="AI career assistant"
          width={350}
          height={350}
          className="absolute top-6 right-8 z-0 "
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="text-4xl font-bold">Your Personalized Interviews</h2>
        <div className="interviews-section">
          {YourinterviewData?.map((interview) => (
            <InterviewCard
              key={`past-${interview.id}`}
              interviewId={interview.id}
              {...interview}
            />
          ))}
          {YourinterviewData?.length === 0 && (
            <p className="text-lg text-gray-500">
              No interviews yet. Please create your own Personalized interview.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className="interviews-section">
          {allInterviewData?.map((interview) => (
            <InterviewCard
              key={`all-${interview.id}`}
              interviewId={interview.id}
              {...interview}
            />
          ))}
          {allInterviewData?.length === 0 && (
            <p className="text-lg text-gray-500">
              No community interviews available.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
