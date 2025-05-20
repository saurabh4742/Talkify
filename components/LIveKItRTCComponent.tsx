"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useMyContext } from '@/ContextProvider';
import { abusiveWords } from "@/Abuse";
import toast from 'react-hot-toast';
import { useWarning } from './WarningContext';
export default function LIveKItRTCComponent() {
  const {warningCount, incrementWarning } = useWarning();
  const { room ,setisAlone,isAlone} = useMyContext();
  const session = useSession();
  const name = session.data?.user?.name;
  const id = session.data?.user?.id;
  const [token, setToken] = useState("");
  const normalizeText = (input: string) => {
  return input.toLowerCase().replace(/[^a-zA-Z\u0900-\u097F]/g, "").trim();
};

const isAbusive = (msg: string) => {
  const normalized = normalizeText(msg);
  return abusiveWords.some((word) => normalized.includes(normalizeText(word)));
};
useEffect(() => {
  const SpeechRecognition =
    typeof window !== "undefined" &&
    ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  if (!SpeechRecognition) {
  console.warn("SpeechRecognition not supported on this device.");
  return;
}
  if (!SpeechRecognition || !id) return;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  let isManuallyStopped = false;
  let isRecognitionActive = false;
  let restartTimeout: NodeJS.Timeout | null = null;

  const safeStart = () => {
    if (!isRecognitionActive && !isManuallyStopped) {
      try {
        recognition.start();
        isRecognitionActive = true;
        console.log("Recognition started");
      } catch (err) {
        console.warn("Recognition start failed:", err);
      }
    }
  };

  recognition.onstart = () => {
    isRecognitionActive = true;
    console.log("Recognition has started.");
  };

  recognition.onend = () => {
    isRecognitionActive = false;
    console.log("Recognition ended.");
    if (!isManuallyStopped) {
      console.log("Unexpected stop. Restarting after 500ms...");
      restartTimeout = setTimeout(() => {
        safeStart(); // Restart safely
      }, 500);
    }
  };

  recognition.onerror = (e: any) => {
    console.warn("Speech Recognition Error:", e.error);
    if (e.error !== "aborted" && !isManuallyStopped) {
      restartTimeout = setTimeout(() => {
        safeStart(); // Safe restart on recoverable errors
      }, 500);
    }
  };

  recognition.onresult = async (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(" ");
    console.log("Transcript:", transcript);

    if (isAbusive(transcript)) {
      if(!isAlone){
  incrementWarning();
      }
  console.warn("⚠️ Abusive content detected!");

  if (warningCount >= 3) {
    isManuallyStopped = true;
    recognition.stop();
    console.warn("⛔ Recognition stopped due to abuse.");
  } else {
    // Soft restart for early abuse
    recognition.stop();
    console.warn("🟠 Soft abuse restart triggered.");
  }
}

  };

  safeStart(); // Initial start

  return () => {
    isManuallyStopped = true;
    recognition.stop();
    if (restartTimeout) clearTimeout(restartTimeout);
  };
}, [id, incrementWarning, isAlone, warningCount]);


  useEffect(() => {
    (async () => {
      if (room && id) {
        try {
          const resp = await fetch(`/api/livekit?room=${room}&username=${name}`);
          const data = await resp.json();
          setToken(data.token);

          // if (data.token) {
          //   await axios.put("/api/getroom", { id, room, capacity: 1 });
          // }
        } catch (e) {
          console.error(e);
        }
      }

      if (!token) {
        try {
          await axios.delete(`/api/endtoendchat`);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [id, name, room, token]);

  if (token === "") {
    return (
      <div className="flex justify-center items-center w-full h-full text-lg">
        {/* Optional: add loading state */}
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
    >
      <MyVideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const { setisAlone,isAlone} = useMyContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const uniqueParticipantIds = new Set(tracks.map((t) => t.participant.sid));
  setisAlone(uniqueParticipantIds.size <= 1);

  if (isAlone) {
    return (
      <div className="w-full sm:h-full flex flex-col justify-center items-center h-[40vh] text-center sm:p-0 p-16">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-green-700 font-medium">Searching for people...</p>
      </div>
    );
  }

  return (
    <GridLayout tracks={tracks}>
      <ParticipantTile />
    </GridLayout>
  );
}
