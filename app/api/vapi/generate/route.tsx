import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { interviewCovers } from "@/constants";

export async function GET() {
  return Response.json({ message: "Hello Get route!" }, { status: 200 });
}

export async function POST(request: Request) {
  const randomCover =
    interviewCovers[Math.floor(Math.random() * interviewCovers.length)];
  const { type, role, techstack, level, amount, userid } = await request.json();
  if (!type || !role || !techstack || !level || !amount || !userid) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }
  try {
    const refinedPrompt = `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `;

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: refinedPrompt,
    });

    const Interview = {
      role,
      type,
      level,
      techstack: Array.isArray(techstack) ? techstack : techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: randomCover,
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(Interview);
    console.log("Interview added to Firestore:", Interview);

    return Response.json({
      message: "Questions generated and saved successfully",
      status: 200,
    });
  } catch (e) {
    console.log(e);
    return Response.json(
      { message: "Error in generating the project" },
      { status: 500 }
    );
  }
}
