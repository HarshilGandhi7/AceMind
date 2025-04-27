import Agent from "@/app/component/agent";
import { db } from "@/firebase/admin";
import { GetCurrentUser } from "@/lib/actions/auth.actions";
import Image from "next/image";

const Page = async ({ params }: { params: { id: string } }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const docRef = db.collection("interviews").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return <div>Interview not found</div>;
  }
  const interviewData = doc.data();
  if (!interviewData) {
    return <div>Interview not found</div>;
  }
  const User = await GetCurrentUser();

  return (
    <div>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={interviewData.coverImage || "/covers/default.jpg"}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interviewData.role} Interview</h3>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {interviewData.techstack.map((tech: string, index: number) => (
              <div
                key={`${tech}-${index}`}
                className="bg-dark-200 px-3 py-1 rounded-lg"
              >
                <span className="text-sm">{tech}</span>
              </div>
            ))}
          </div>{" "}
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interviewData.type}
        </p>
      </div>

      <div className="mt-6">
        <Agent
          userName={User?.name || "user"}
          userId={User?.id}
          type="interview"
          interviewId={id}
          questions={interviewData.questions}
        ></Agent>
      </div>
    </div>
  );
};

export default Page;
