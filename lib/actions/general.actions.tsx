"use server";

import { db } from "@/firebase/admin";
import { GetCurrentUser } from "./auth.actions";
import { generateObject } from "ai";
import { feedbackSchema } from "@/constants";
import { google } from "@ai-sdk/google";

export async function getYourInterviewData() {
  const user = await GetCurrentUser();
  if (!user) return null;
  const interviewData = await db
    .collection("interviews")
    .where("userId", "==", user.id)
    .get();
  if (interviewData.empty) return null;
  return interviewData.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Interview[];
}

export async function getAllInterviews() {
  const user = await GetCurrentUser();
  if (!user) return null;
  const interviewData = await db
    .collection("interviews")
    .where("userId", "!=", user.id)
    .get();
  return interviewData.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Interview[];
}

export async function createFeedback(params: CreateFeedbackParams) {
  try {
    const { userId, interviewId, transcript } = params;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Be very strict, detailed, and thorough.You must score each category between 0 and 100 (not out of 10). Round off to 1 decimal point if needed.
.

Transcript:
${transcript.map((msg) => msg.content).join("\n")}

Please fill the following structured fields:

- totalScore (number)
- categoryScores (tuple of 5 objects with name, score, comment)
- strengths (list of short bullet points)
- areasForImprovement (list of short bullet points)
- finalAssessment (short paragraph)


Strictly follow the field names and types.`,
      system:
        "You are a professional AI interviewer generating structured evaluation feedback.",
    });

    const feedbackRef = await db.collection("feedback").add({
      interviewId: interviewId,
      userId: userId,
      ...object,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      id: feedbackRef.id,
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, id: "" };
  }
}
