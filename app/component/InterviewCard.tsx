import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { interviewCovers } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "./displayTechIcons";
import { db } from "@/firebase/admin";
import { GetCurrentUser } from "@/lib/actions/auth.actions";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  level,
  questions,
  finalized,
  createdAt,
  coverImage,
}: InterviewCardProps) => {
  const User=await GetCurrentUser();
  const fetchData = async () => {
    try {
      const feedback = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", User?.id)
        .get();

      if (feedback.empty) {
        console.log("No feedback found for this interview and user.");
        return null;
      }

      const feedbackDoc = feedback.docs[0];
      const feedbackData = feedbackDoc.data();
      if (
        feedbackData.interviewId === interviewId &&
        feedbackData.userId === userId
      ) {
        return {
          score: feedbackData.totalScore,
          id: feedbackDoc.id,
        };
      } else {
        console.log("No valid feedback matching criteria.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return null;
    }
  };

  const feedbackData = await fetchData();
  const feedbackScore = feedbackData?.score;
  const feedbackId = feedbackData?.id;

  const formattedDate = dayjs(createdAt || Date.now()).format("DD MMM YYYY");
  const interviewUrl = feedbackId
    ? `/interview/${feedbackId}/feedback`
    : `/interview/${interviewId}`;

  return (
    <div>
      <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview">
          <div>
            <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bg-lg bg-light-600">
              <p className="badge-text">{type}</p>
            </div>
            <Image
              src={coverImage || "/covers/default.jpg"}
              alt="cover"
              width={90}
              height={90}
              className="rounded-full object-fit size-[90px]"
            />
            <h3 className="mt-5 capitalize">{role} Interview</h3>
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2">
                <Image
                  src="/calendar.svg"
                  alt="calendar"
                  width={22}
                  height={22}
                />
                <p>{formattedDate}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" alt="star" width={22} height={22} />
                <p>{feedbackScore || "---"}/100</p>
              </div>
            </div>

            <p className="line-clamp-2 mt-5">
              {feedbackData
                ? "You have taken the interview. Check your report for detailed feedback."
                : "You haven't taken the interview yet. Take it now to improve your skills."}
            </p>

            <div className="flex flex-row justify-between items-center mt-4">
              <DisplayTechIcons techStack={techstack} />
              <Link href={interviewUrl}>
                <Button className="btn-primary">
                  {feedbackData ? "Check Feedback" : "View Interview"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
