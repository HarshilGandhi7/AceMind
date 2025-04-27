import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
// import { dummyInterviews } from "@/constants";
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
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-4xl font-bold">
            Interview Ready with AI-powered practice
          </h2>
          <p className="text-lg text-gray-500">
            Practice on real interview questions & get instant feedback
          </p>
        </div>
        <Button asChild className="btn-primary max-sm:w-full">
          <Link href="/interview">Start Interview</Link>
        </Button>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
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
              {" "}
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
