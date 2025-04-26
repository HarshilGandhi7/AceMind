"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/actions/vapi.sdk";

const CALL_STATUS = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ userName, userId, type }: AgentProps) => {
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

  useEffect(() => {
    if (callStatus === CALL_STATUS.FINISHED) {
      router.push("/");
    }
  }, [callStatus]);

  const handleCall = async () => {
    try {
      const response = await vapi.start(process.env.NEXT_PUBLIC_ASSISTANT_API_KEY!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      }); 
      

    } catch (error) {
      setcallStatus(CALL_STATUS.FINISHED);
    }
  };

  const handleDisconnect = async () => {
    console.log(messages);
    setcallStatus(CALL_STATUS.FINISHED);
    vapi.stop();
  };

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
            <p
              key={messages.length - 1}
              className={cn(
                "transition-opacity duration-500 opacity-0,animete-fadeIn opa"
              )}
            >
              {messages[messages.length - 1]?.content}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
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
