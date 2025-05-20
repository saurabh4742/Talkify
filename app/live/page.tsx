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
      window.location.reload();
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
  };

  const nextMatchmaking = () => {
    if (!socket || !id || !room) return;
    socket.emit("leave-room", { userId: id, roomId: room });
    setTimeout(() => {
      socket.emit("join-room", id);
    }, 300);
  };

  const sendMessage = () => {
    if (!message.trim() || !socket || !id || !room) return;

    const lowerMessage = message.toLowerCase();
    const containsAbusiveWord = abusiveWords.some((word) =>
      lowerMessage.includes(word.toLowerCase())
    );

    setIsSending(true);
    socket.emit("send-message", { userId: id, roomId: room, message });
    setMessage("");
    setIsSending(false);

    if (containsAbusiveWord) {
      axios
        .post("/api/liveban", { id })
        .then(() => {
          toast.error("Vulgar language detected. You are banned.");
          window.location.reload();
        })
        .catch(() => {
          toast.error("Error banning user.");
        });
    }
  };

  if (session?.user?.banned) return <YouAreBanned />;

return (
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
);
}

export default Live;
