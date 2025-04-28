"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/actions/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.actions";

enum MessageTypeEnum {
  TRANSCRIPT = "transcript",
  STATUS_UPDATE = "status-update",
}

enum MessageRoleEnum {
  ASSISTANT = "assistant",
  USER = "user",
}

enum TranscriptMessageTypeEnum {
  FINAL = "final",
  INTERIM = "interim",
}

interface MessageType {
  TRANSCRIPT: "transcript";
  STATUS_UPDATE: "status-update";
}

interface MessageRole {
  ASSISTANT: "assistant";
  USER: "user";
}

interface TranscriptMessageType {
  FINAL: "final";
  INTERIM: "interim";
}

interface TranscriptMessage {
  type: MessageType["TRANSCRIPT"];
  role: MessageRole["ASSISTANT"] | MessageRole["USER"];
  transcriptType:
    | TranscriptMessageType["FINAL"]
    | TranscriptMessageType["INTERIM"];
  transcript: string;
}

interface StatusMessage {
  type: MessageType["STATUS_UPDATE"];
  status: string;
  endedReason?: string;
}

type Message = TranscriptMessage | StatusMessage;

const CALL_STATUS = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setcallStatus] = useState(CALL_STATUS.INACTIVE);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const onCall = () => {
      setcallStatus(CALL_STATUS.ACTIVE);
    };
    const onDisconnect = () => {
      setcallStatus(CALL_STATUS.FINISHED);
    };
    const onMessage = (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const onError = (error: Error) => {
      console.error("Error:", error);
      setcallStatus(CALL_STATUS.FINISHED);
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };
    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    vapi.on("call-start", onCall);
    vapi.on("call-end", onDisconnect);
    vapi.on("message", onMessage);
    vapi.on("error", onError);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);

    return () => {
      vapi.off("call-start", onCall);
      vapi.off("call-end", onDisconnect);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
    };
  }, []);

  const handleFeedback = async () => {
    const transcriptData = messages
      .filter((msg) => msg.type === "transcript")
      .map((msg) => ({
        role: msg.role,
        content: msg.transcript,
      }));
    const result = await createFeedback({
      interviewId: interviewId || "",
      userId: userId || "",
      transcript: transcriptData,
    });
    console.log(result)
    if (result && result.success && result.id) {
      router.push(`/interview/${result.id}/feedback`);
    } else {
      console.log("Error in feedback submission");
      router.push("/");
    }
  };
  useEffect(() => {
    if (callStatus === CALL_STATUS.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleFeedback();
      }
    }
  }, [callStatus]);

  const handleCall = async () => {
    try {
      if (type === "generate") {
        const response = await vapi.start(
          process.env.NEXT_PUBLIC_ASSISTANT_API_KEY!,
          {
            variableValues: {
              username: userName,
              userid: userId,
            },
          }
        );
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      setcallStatus(CALL_STATUS.FINISHED);
    }
  };

  const handleDisconnect = async () => {
    console.log(messages);
    setcallStatus(CALL_STATUS.FINISHED);
    vapi.stop();
  };

  const latest_message =
    messages[messages.length - 1]?.type === "transcript"
      ? (messages[messages.length - 1] as TranscriptMessage).transcript
      : "";

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
        <div
          className={cn(
            "transcript-border",
            type === "interview" ? "my-8" : "my-0"
          )}
        >
          {" "}
          <div className="transcript">
            <p
              key={messages.length - 1}
              className={cn(
                "transition-opacity duration-500 opacity-0,animete-fadeIn opa"
              )}
            >
              {latest_message}
            </p>
          </div>
        </div>
      )}

      <div
        className={cn(
          "w-full flex justify-center",
          type === "interview" ? "mt-8" : "mt-0"
        )}
      >
        {callStatus !== CALL_STATUS.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn("absolute animate-ping rounded-full opacity-75")}
            />
            <span>
              {callStatus === CALL_STATUS.INACTIVE ||
              callStatus === CALL_STATUS.FINISHED
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
