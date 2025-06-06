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
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useMyContext } from '@/ContextProvider';
import { abusiveWords } from "@/Abuse";
import toast from 'react-hot-toast';
import { useWarning } from './WarningContext';

export default function LiveKitRTCComponent() {
  const { warningCount, incrementWarning } = useWarning();
  const { room, setisAlone, isAlone } = useMyContext();
  const session = useSession();
  const name = session.data?.user?.name;
  const id = session.data?.user?.id;
  const [token, setToken] = useState("");
  const deepgramSocketRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  // Enhanced abuse detection with Hinglish patterns
const normalizeText = (input: string) => {
  return input
    .toLowerCase()
    // Normalize similar sounding characters
    .replace(/[ओो]/g, 'o')
    .replace(/[आा]/g, 'a')
    .replace(/[ईी]/g, 'i')
    .replace(/[उु]/g, 'u')
    .replace(/[एे]/g, 'e')
    .replace(/[ऐै]/g, 'ai')
    .replace(/[औौ]/g, 'au')
    // Common transliterations
    .replace(/sh/g, 's')
    .replace(/ph/g, 'f')
    .replace(/th/g, 't')
    .replace(/aa/g, 'a')
    .replace(/ii/g, 'i')
    .replace(/uu/g, 'u')
    .replace(/oo/g, 'u')
    .replace(/ee/g, 'i')
    .replace(/nn/g, 'n')
    .replace(/dd/g, 'd')
    .replace(/tt/g, 't')
    // Remove special characters but keep Hindi letters
    .replace(/[^a-z\u0900-\u097F]/g, "")
    .trim();
};

  // Enhanced abuse detection with Hindi/Hinglish patterns
  const isAbusive = (msg: string) => {
    const normalized = normalizeText(msg);
    
    // Check against abusive words list (case insensitive)
    const normalizedAbuseWords = abusiveWords.map(word => normalizeText(word));
    if (normalizedAbuseWords.some(word => normalized.includes(word))) {
      return true;
    }
    
    // Check for common Hindi/Hinglish abusive patterns
    const hindiPatterns = ['चोद',
    'माँचोद', 'मांचोद', 'माचोद', 'मादरचोद', 'मदरचोद', 'माडरचोद',
  'माँचुद', 'मांचुद', 'माचुद', 'मादरचुद', 'मदरचुद',
  'माँचोदी', 'मांचोदी', 'माचोदी',
  'माँचोदने', 'मांचोदने', 'माचोदने',
  'माचोदवा', 'मादरखोद', 'मदरखोद',
  
  // Bhosda variations
  'भोसड़ा', 'भोसडा', 'भसड़ा', 'भसडा', 'भोसदा', 'भोस्दा',
  'भोसड़े', 'भोसडे', 'भसड़े', 'भसडे', 'भोसदे', 'भोस्दे',
  'भोसड़ी', 'भोसडी', 'भसड़ी', 'भसडी', 'भोसदी', 'भोस्दी',
  'भोसड़ाक', 'भोसडाक', 'भसड़ाक', 'भसडाक',
  
  // Lund variations
  'लंड', 'लुंड', 'लौंडा', 'लौडा', 'लोडा', 'लोंडा',
  'लंडी', 'लुंडी', 'लौंडी', 'लौडी', 'लोडी',
  'लंडू', 'लुंडू', 'लौंडू', 'लौडू', 'लोडू',
  'लंडवा', 'लुंडवा', 'लौंडवा',
  'लंडभज', 'लुंडभज', 'लौंडभज',
  
  // Gaand variations
  'गांड', 'गांडू', 'गांड़', 'गांडवा', 'गांडु', 'गांडा',
  'गांडी', 'गांडिन', 'गांडूँ', 'गांडे', 'गांडो',
  'गांडमार', 'गांडफाड़', 'गांडछेद',
  'गांडखोद', 'गांडखोदू',
  
  // Chut variations
  'चूत', 'चूतिया', 'चुटिया', 'चूतड़', 'चूतड', 'चूतडा',
  'चूतड़ी', 'चूतडी', 'चूतड़े', 'चूतडे',
  'चूतमार', 'चूतखोद', 'चूतपाटी',
  'चूतके', 'चूतकी', 'चूतका',
  
  // General abuses
  'हरामी', 'हराम', 'हरामखोर', 'हरामजादा', 'हरामपुत्र',
  'कुत्ता', 'कुतिया', 'कुत्ती', 'कुत्ते', 'कुत्तों',
  'कमीना', 'कमिना', 'कमीनी', 'कमिनी',
  'रंडी', 'रांड', 'रंडवा', 'रंडीखाना', 'रंडीबाज'
];
    
    return hindiPatterns.some(word => normalized.includes(word));
  };

  const startDeepgramTranscription = async () => {
    try {
      // Get microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;

      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?language=multi&model=nova-3`,
        ['token', process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!]
      );
      deepgramSocketRef.current = socket;

      socket.onopen = () => {
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
          audioBitsPerSecond: 16000 // Lower bitrate optimized for speech
        });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(e.data);
          }
        };

        mediaRecorder.start(500); // Keep original 500ms chunks
      };

      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // Only check final results to reduce false positives
        if (data.is_final) {
          const transcript = data.channel?.alternatives?.[0]?.transcript || '';
          // console.log("Transcriptt:"+transcript );
          if (transcript.trim() && (isAbusive(transcript) || isAbusive(normalizeText(transcript)))) {
            handleAbuseDetection(transcript);
          }
        }
      };

      socket.onerror = (error) => {
        console.error("Deepgram error:", error);
        toast.error("Voice moderation service error");
        restartDeepgramConnection();
      };

      socket.onclose = () => {
        console.log("Deepgram connection closed");
        if (warningCount < 3) {
          // restartDeepgramConnection();
        }
      };

    } catch (error) {
      console.error("Error starting Deepgram:", error);
      toast.error("Microphone access required for voice moderation");
    }
  };

  const handleAbuseDetection = (transcript: string) => {
    // console.log("Abuse detected:", transcript);
    if (!isAlone) {
      incrementWarning();
      const remaining = 3 - (warningCount + 1);
    }

    if (warningCount >= 2) {
      handleAbuseViolation();
    }
  };

  const handleAbuseViolation = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (deepgramSocketRef.current) {
      deepgramSocketRef.current.close();
    }
    toast.error("Microphone disabled due to violations");
  };

  const restartDeepgramConnection = () => {
    cleanupDeepgram();
    setTimeout(() => {
      if (warningCount < 3) {
        startDeepgramTranscription();
      }
    }, 3000); // Keep original 2 second delay
  };

  const cleanupDeepgram = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
    }
    deepgramSocketRef.current?.close();
    audioStreamRef.current?.getTracks().forEach(track => track.stop());
    
    mediaRecorderRef.current = null;
    deepgramSocketRef.current = null;
    audioStreamRef.current = null;
  };

  useEffect(() => {
    if (token && !isAlone) {
      startDeepgramTranscription();
    } else {
      cleanupDeepgram();
    }

    return () => {
      cleanupDeepgram();
    };
  }, [token, isAlone, warningCount]);

  useEffect(() => {
    (async () => {
      if (room && id) {
        try {
          const resp = await fetch(`/api/livekit?room=${room}&username=${name}`);
          const data = await resp.json();
          setToken(data.token);
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
    return <div className="flex justify-center items-center w-full h-full text-lg"></div>;
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
  const { setisAlone, isAlone } = useMyContext();
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const uniqueParticipantIds = new Set(tracks.map((t) => t.participant.sid));

  useEffect(() => {
    setisAlone(uniqueParticipantIds.size <= 1);
  }, [uniqueParticipantIds.size, setisAlone]);

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