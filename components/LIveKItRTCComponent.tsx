"use client";

import '@livekit/components-styles';
import {
  LiveKitRoom,
  VideoConference,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function LIveKItRTCComponent() {
  //  get user input for server and name
  const session=useSession();
  const room = "Uniq12345";
  const name = session.data?.user?.name;
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `/api/livekit?room=${room}&username=${name}`
        );
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  if (token === "") {
    return <div className='flex justify-center items-center w-full h-full text-lg'><Loader2 className='animate-spin '/></div>;
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      
      data-lk-theme="default"
      className=' relative flex w-full justify-center items-center shadow-lg rounded-2xl '
    >
      
      <MyVideoConference  />
      
      <RoomAudioRenderer />
      {/* <ControlBar   /> */}
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} >
      <ParticipantTile />
    </GridLayout>
  );
}
