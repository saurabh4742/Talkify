"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useMyContext } from "@/ContextProvider";
import { useSocket } from "@/components/SocketProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { abusiveWords } from "@/Abuse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, StopCircle, SkipForward, MonitorPlay } from "lucide-react";
import { YouAreBanned } from "@/components/YouAreBanned";
import BanPolicy from "@/components/BanPolicy";
import LIveKItRTCComponent from "@/components/LIveKItRTCComponent";
import { useIsClient } from "@/hooks/use-is-client";
import { useWarning } from "@/components/WarningContext";
import { Warning } from "@/components/Warning";

interface ChatMessage {
  senderId: string;
  message: string;
}

const Live = () => {
  const { data: session } = useSession();
  const id = session?.user?.id || "";
  const socket = useSocket();
  const { room, setRoom } = useMyContext();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [matching, setMatching] = useState(false);
  const { warningCount, incrementWarning } = useWarning();
  const [showWarning, setShowWarning] = useState(false);
    useEffect(() => {
    if (warningCount > 3 && id) {
      axios
        .post("/api/liveban", { id })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          console.error("Ban error:", err);
        });
    }
  }, [warningCount, id]);
  useEffect(() => {
    if (!socket) return;

    socket.on("room-joined", (roomData) => {
      setRoom(roomData.id);
      setMessages([]);
      setMatching(false);
      console.log("Joined room:", roomData.id);
    });

    socket.on("receive-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("left-room", () => {
      setRoom("");
      setMessages([]);
      setMatching(false);
    });

    return () => {
      socket.off("room-joined");
      socket.off("receive-message");
      socket.off("left-room");
    };
  }, [socket, setRoom]);

  const startMatchmaking = () => {
    if (!socket || !id) return;
    setMatching(true);
    socket.emit("join-room", id);
  };

  const stopMatchmaking = () => {
    if (!socket || !id || !room) return;
    socket.emit("leave-room", { userId: id, roomId: room });
    window.location.reload();
  };

  const nextMatchmaking = () => {
    if (!socket || !id || !room) return;
    socket.emit("leave-room", { userId: id, roomId: room });
    setTimeout(() => {
      socket.emit("join-room", id);
    }, 300);
  };

  const normalizeText = (input: string) => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z\u0900-\u097F]/g, "")
    .trim();
};

const isAbusive = (msg: string) => {
  const normalized = normalizeText(msg);
  return abusiveWords.some((word) => normalized.includes(normalizeText(word)));
};

  const sendMessage = () => {
    if (!message.trim() || !socket || !id || !room) return;

    // const lowerMessage = message.toLowerCase();
    // const containsAbusiveWord = abusiveWords.some((word) =>
    //   lowerMessage.includes(word.toLowerCase())
    // );

    setIsSending(true);
    socket.emit("send-message", { userId: id, roomId: room, message });
    setMessage("");
    setIsSending(false);

    if (isAbusive(message)) {
      
      incrementWarning();
      setShowWarning(true);
    }
  };
  useEffect(() => {
  if (warningCount > 0 && warningCount <= 3) {
    setShowWarning(true);
  }
}, [warningCount]);
    const isClient = useIsClient();
  if (!isClient) return null;
  if (session?.user?.banned) return <YouAreBanned />;

return (
  <>
    {showWarning && warningCount <= 3 && (
      <Warning num={warningCount} onClose={() => setShowWarning(false)} />
    )}

    <div className="w-full sm:h-[90vh] bg-white sm:flex space-y-4 items-center justify-center p-2 text-3xl">
      <div className="sm:h-full sm:w-4/12 sm:flex sm:flex-col justify-center gap-4 items-center">
        <LIveKItRTCComponent />
      </div>

      <div className="sm:h-full sm:w-8/12 w-full flex flex-col bg-background shadow-lg rounded-2xl justify-between items-center">
        {room ? (
          <>
            <div className="text-lg overflow-auto w-full p-4 gap-4 sm:flex flex-col justify-center items-center">
              {messages.map((chat, idx) => (
                <p
                  key={idx}
                  className="w-full flex justify-start items-center"
                >
                  <span className={`text-${chat.senderId === id ? "primary" : "red-600"}`}>
                    <strong>{chat.senderId === id ? "You" : "Random"}:</strong>
                  </span>{" "}
                  {chat.message}
                </p>
              ))}
            </div>

            <div className="w-full flex justify-between items-center p-2 gap-2">
              <Button onClick={stopMatchmaking} variant="destructive" size="lg" className="rounded-2xl">
                <StopCircle />
                Stop
              </Button>

              <Button onClick={nextMatchmaking} variant="default" size="lg" className="rounded-2xl">
                Next
                <SkipForward />
              </Button>

              <div className="w-full relative flex justify-between items-center">
                <Input
                  placeholder="Chat Now..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isSending) sendMessage();
                  }}
                />
                <Button
                  disabled={isSending}
                  onClick={sendMessage}
                  className="absolute right-0 p-2 rounded-xl"
                  variant="outline"
                >
                  <SendHorizontal />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full sm:h-[90vh] bg-white flex flex-col items-center gap-4 justify-center text-sm p-2">
            <Button size="lg" disabled={matching} onClick={startMatchmaking}>
              <MonitorPlay className="mr-2" />
              {matching ? "Going..." : "Go Live"}
            </Button>
            <BanPolicy />
          </div>
        )}
      </div>
    </div>
  </>
);
}

export default Live;
