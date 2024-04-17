"use client";
import LIveKItRTCComponent from "@/components/LIveKItRTCComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, StopCircle } from "lucide-react";
import React, { useState } from "react";
import { MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useMyContext } from "@/ContextProvider";
import { useSession } from "next-auth/react";
const Live = () => {
  const [matching, setMatching] = useState(false);
  const router = useRouter();
  const session=useSession();
  const id=session.data?.user?.id

  const { room, setRoom } = useMyContext();
  const startMatchmaking = async () => {
    try {
      setMatching(true)
      const res = await axios.get("/api/getroom");
      setMatching(false)
      if (res.data.server) {
        setRoom(res.data.server.id);
      }
      
    } catch (error) {
      setRoom("");
      setMatching(false)
    }
  };
  const stopMatchmaking=async ()=>{
    try {
      const res=await axios.put("/api/getroom",{id,room,capacity:-1})
      setRoom("");
      window.location.reload();
    } catch (error) {
    }
  }
  return (
    <div className="w-full sm:h-[90vh] bg-white sm:flex space-y-4 items-center  justify-center p-2 text-3xl ">
      <div className="sm:h-full    sm:w-4/12 p-2   sm:flex sm:flex-col justify-center gap-4  items-center">
        <LIveKItRTCComponent />
      </div>
      <div className="sm:h-full sm:w-8/12 w-full flex flex-col bg-background shadow-lg rounded-2xl p-2 justify-between  items-center">
        {room ? (
          <>
            <div className="  text-lg overflow-auto w-full  p-4 gap-4  sm:flex flex-col justify-center items-center ">
              <p className="w-full flex justify-start items-center">
                <span className="text-red-600 ">Random:</span>Ami Tumake Bhalo
                basi
              </p>
              <p className="w-full flex justify-Start  items-center">
                <span className="text-primary ">You:</span>Ek to pori
              </p>
              <p className="w-full flex justify-start items-center">
                <span className="text-red-600 ">Random:</span>Ami Tumake Bhalo
                basi
              </p>
              <p className="w-full flex justify-Start  items-center">
                <span className="text-primary ">You:</span>Ek to pori
              </p>
            </div>
            <div className="w-full h-2/6 flex justify-between items-center p-2 gap-2">
              <Button size="lg">Next</Button>
              <div className="w-full relative flex justify-between items-center ">
                <Input placeholder="Chat Now..." />
                <Button
                  className="absolute  right-0 p-2 rounded-xl "
                  variant="outline"
                >
                  <SendHorizontal />
                </Button>
              </div>
              
            </div>
            <Button onClick={
              stopMatchmaking
            } variant="destructive" size="lg" ><StopCircle/>Stop</Button>
          </>
        ) : (
          <div className="w-full sm:h-[90vh] bg-white flex items-center  justify-center p-2 text-3xl">
            <Button size="lg" disabled={matching} onClick={startMatchmaking}>
              <MonitorPlay className="mr-2" />{" "}
              {matching ? "Matching..." : "Start Matching Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;
