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
- Format for voice assistant delivery (no special characters)
- Prioritize changes by impact on ATS scoring
- Include both quick fixes and long-term improvements
- Compare against top performers in ${role} positions
- Provide 3-4 links to online resources related to specific (${role}) role to help the user understand best practices. Ensure the links are functional and relevant to the role.
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
