"use server";

import { db } from "@/firebase/admin";
import { GetCurrentUser } from "./auth.actions";

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