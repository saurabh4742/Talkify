"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import LIveKItRTCComponent from "@/components/LIveKItRTCComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, SendHorizontal, StopCircle } from "lucide-react";
import React, {  useState } from "react";
import { MonitorPlay } from "lucide-react";
import axios from "axios";
import { useMyContext } from "@/ContextProvider";
import { useSession } from "next-auth/react";
import BanPolicy from "@/components/BanPolicy";
import { useQuery } from "@tanstack/react-query";
import { Chat } from "@prisma/client";
import { abusiveWords } from "@/Abuse";
import toast from "react-hot-toast";
import { YouAreBanned } from "@/components/YouAreBanned";
import { PiWarning } from "react-icons/pi";
const Live = () => {
  const [matching, setMatching] = useState(false);
  const session = useSession();
  const id = session.data?.user?.id;
  const [send, isSending] = useState(false);
  const { room, setRoom } = useMyContext();
  const [message, setMessage] = useState("");
  const startMatchmaking = async () => {
    try {
      setMatching(true);
      const res = await axios.get("/api/getroom");
      setMatching(false);
      if (res.data.server) {
        setRoom(res.data.server.id);
      }
    } catch (error) {
      setRoom("");
      setMatching(false);
    }
  };

  const SendMessages = async () => {
    try {
      isSending(true);
      const containsAbusiveWord = abusiveWords.some(word =>
        message.toLowerCase().includes(word.toLowerCase())
      );
  
      if (containsAbusiveWord) {
        const exitroom = await axios.put("/api/getroom", { id, room, capacity: -1 });
      setRoom("");
        const res = await axios.post("/api/liveban", {
          id
        });
        toast.success("vulgur detected, WARNING");
        window.location.reload();
      } else {
        // If no abusive words detected, send the message
        const res = await axios.post("/api/endtoendchat", {
          serverId: room,
          senderId: id,
          message,
        });
        setMessage("");
      }
      isSending(false);
      setMessage("");
    } catch (error) {
      setMessage("");
      console.log("Hgt error sending message");
      isSending(false);
    }
  };

  const FetchChats = async () => {
    try {
      const response = await axios.get(`/api/endtoendchat?serverId=${room}`);
      return response.data.chats;
    } catch (error) {
      return null; 
    }
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["chats"],
    queryFn: FetchChats,
    refetchInterval: 1000,
    refetchIntervalInBackground: true,
    enabled: true,
    refetchOnWindowFocus: true,
  });
  const stopMatchmaking = async () => {
    try {
      const res = await axios.put("/api/getroom", { id, room, capacity: -1 });
      setRoom("");
      window.location.reload();
    } catch (error) {}
  };
  if (session.data?.user?.banned)
    {
      return (<YouAreBanned/>)
    }
  else{
  return (
    
    <div className="w-full sm:h-[90vh] bg-white sm:flex space-y-4 items-center  justify-center p-2 text-3xl ">
      <div className="sm:h-full    sm:w-4/12 p-2   sm:flex sm:flex-col justify-center gap-4  items-center">
        <LIveKItRTCComponent />
      </div>
      <div className="sm:h-full sm:w-8/12 w-full flex flex-col bg-background shadow-lg rounded-2xl p-2 justify-between  items-center">
        {room ? (
          <>
            <div className="text-lg overflow-auto w-full p-4 gap-4 sm:flex flex-col justify-center items-center">
              {isLoading && <div className='flex justify-center items-center w-full h-full text-lg'><Loader2 className='animate-spin '/></div>}
              {isError && <div>Error: {error.message}</div>}
              {data && (
                <>
                  {data.map((chat: Chat) => (
                    <p
                      key={chat.id}
                      className={`w-full flex justify-start items-center`}
                    >
                      <span
                        className={`text-${
                          chat.senderId === id ? "primary" : "red-600"
                        }`}
                      >
                        {chat.senderId === id ? "You" : "Random"}:
                      </span>
                      {chat.message}
                    </p>
                  ))}
                </>
              )}
            </div>
            <div className="w-full h-2/6 flex justify-between items-center p-2 gap-2">
            <TooltipProvider>
  <Tooltip>
    <TooltipTrigger><Button className="rounded-2xl" size="icon" variant="destructive"><PiWarning/></Button></TooltipTrigger>
    <TooltipContent className="rounded-none">
      <p>Report</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

              
              <Button onClick={stopMatchmaking} variant="destructive" size="lg">
                <StopCircle />
                Stop
              </Button>
              <div className="w-full relative flex justify-between items-center ">
                <Input
                  placeholder="Chat Now..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <Button
                  disabled={send}
                  onClick={SendMessages}
                  className="absolute  right-0 p-2 rounded-xl "
                  variant="outline"
                >
                  <SendHorizontal />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full sm:h-[90vh]  bg-white flex flex-col items-center gap-4  justify-center text-sm p-2">
            <Button size="lg" disabled={matching} onClick={startMatchmaking}>
              <MonitorPlay className="mr-2" />{" "}
              {matching ? "Going..." : "Go Live"}
            </Button>
            <BanPolicy />
          </div>
        )}
      </div>
    </div>
  );
}
};

export default Live;
