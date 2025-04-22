import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const CALL_STATUS = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ userName, userId, type }: AgentProps) => {
  const isSpeaking = true;
  const currentCallStatus = CALL_STATUS.FINISHED;
  const messages = [
    "Hello, I am your AI interviewer.",
    "I will ask you a series of questions.",
  ];
  const lastMessage = messages[messages.length - 1];

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI Avatar"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.jpg"
              alt="User Avatar"
              width={140}
              height={140}
              className="object-cover rounded-full"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0,animete-fadeIn opa')}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {currentCallStatus !== CALL_STATUS.ACTIVE ? (
          <button className="relative btn-call">
            <span
              className={cn("absolute animate-ping rounded-full opacity-75")}
            />
            <span>
              {currentCallStatus === CALL_STATUS.INACTIVE ||
              currentCallStatus === CALL_STATUS.FINISHED
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
