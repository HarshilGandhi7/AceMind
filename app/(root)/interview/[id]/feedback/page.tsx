import { db } from "@/firebase/admin";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const doc = await db.collection("feedback").doc(id).get();
  
  if (!doc.exists) {
    return <div className="container mx-auto p-8 text-center text-white">Feedback not found</div>;
  }

  const feedbackData = doc.data();
  if (!feedbackData) {
    return <div className="container mx-auto p-8 text-center text-white">Feedback not found</div>;
  }

  const getScoreColor = (score: number) => {
    if (score < 30) return "bg-red-500";
    if (score < 60) return "bg-yellow-500";
    if (score < 80) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const getTextColor = (score: number) => {
    if (score < 30) return "text-red-500";
    if (score < 60) return "text-yellow-500";
    if (score < 80) return "text-blue-500";
    return "text-green-500";
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-4">Interview Feedback</h1>
      
      <div className="flex items-center mb-10">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold ${getScoreColor(feedbackData.totalScore)}`}
        >
          {feedbackData.totalScore}
        </div>
        <span className="ml-4 text-lg text-gray-300">Total Score</span>
      </div>
      
      <div className="space-y-8 mb-10">
        {[
          { label: "Communication Skills", score: feedbackData.communicationSkillsScore, comment: feedbackData.communicationSkillsComment },
          { label: "Technical Knowledge", score: feedbackData.technicalKnowledgeScore, comment: feedbackData.technicalKnowledgeComment },
          { label: "Problem Solving", score: feedbackData.problemSolvingScore, comment: feedbackData.problemSolvingComment },
          { label: "Cultural Fit", score: feedbackData.culturalFitScore, comment: feedbackData.culturalFitComment },
          { label: "Confidence & Clarity", score: feedbackData.confidenceAndClarityScore, comment: feedbackData.confidenceAndClarityComment },
        ].map(({ label, score, comment }) => (
          <div key={label} className="border-b border-gray-700 pb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-white">{label}</h3>
              <span className={`font-bold ${getTextColor(score)}`}>
                {score}/100
              </span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full mb-4">
              <div
                className={`h-full rounded-full ${getScoreColor(score)}`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <p className="text-gray-300">{comment}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-medium text-white mb-4">Key Takeaways</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div>
          <h3 className="font-medium text-green-400 mb-3 border-b border-green-900 pb-2">Strengths</h3>
          <div className="whitespace-pre-line text-gray-300">{feedbackData.strengths}</div>
        </div>
        <div>
          <h3 className="font-medium text-yellow-400 mb-3 border-b border-yellow-900 pb-2">Areas for Improvement</h3>
          <div className="whitespace-pre-line text-gray-300">{feedbackData.areasForImprovement}</div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-medium text-white mb-3 border-b border-gray-700 pb-2">Final Assessment</h3>
        <p className="text-gray-300">{feedbackData.finalAssessment}</p>
      </div>

      <div className="text-right text-xs text-gray-500">
        <p>Feedback generated on {new Date(feedbackData.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Page;