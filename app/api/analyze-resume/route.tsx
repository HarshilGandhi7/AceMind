import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  try {
    const { resumeText, role } = await request.json();

    const refinedPrompt = `Analyze this resume for ATS optimization and provide specific improvement recommendations.
The target job role is: ${role}.

Provide analysis in this exact JSON format:
{
  "score": "X/10",
  "strengths": ["strength1", "strength2"],
  "weaknesses": {
    "content": ["issue1", "issue2"],
    "keyword_optimization": ["missing_keyword1", "missing_keyword2"]
  },
  "custom_recommendations": [
    "specific_change1",
    "specific_change2"
  ],
  "ats_compliance": {
    "parser_issues": ["potential_problem1", "potential_problem2"],
    "compatibility": ["compatible_formats", "incompatible_elements"]
  },
  "project_analysis": [
    {
      "project_name": "Project 1",
      "evaluation": "Project 1 description evaluation and ATS optimization recommendation",
      "specific_recommendations": [
        "Recommendation 1 for Project 1",
        "Recommendation 2 for Project 1"
      ]
    },
    {
      "project_name": "Project 2",
      "evaluation": "Project 2 description evaluation and ATS optimization recommendation",
      "specific_recommendations": [
        "Recommendation 1 for Project 2",
        "Recommendation 2 for Project 2"
      ]
    }
    // Add more project evaluations as needed
  ]
}

Analysis requirements:
1. Evaluate resume against industry standards.
2. Identify missing keywords from the job description
3. Check for proper header structure and section organization
4. Flag any missing critical sections
5. Provide specific wording improvements
6. Keep all suggestions actionable and concise
7. Never return the original resume text

Special instructions:
- The score should be out of 10 with a specific weighted formula: 70% based on relevance to the target role (${role}) and 30% based on content optimization and keyword usage.
- Do NOT assess document formatting aspects such as margins, fonts, spacing, or visual layout.
- Focus only on content, keywords, section organization, and relevance to the ${role} position.
- Prioritize changes by impact on keyword optimization and content quality
- Include both quick fixes and long-term improvements to the substance of the resume
- Compare against top performers in ${role} positions based on skills and experience, not formatting
`;

    const { text: analysis } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `
        ${refinedPrompt.replace("${role}", role)}
        
        Resume Content:
        ${resumeText}
      `,
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}
