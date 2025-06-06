import  { type DefaultSession } from "next-auth"
export type ExtendedUser =DefaultSession["user"] & {
    banned?:boolean
}
declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

import {JWT} from "next-auth/jwt"
 declare module "next-auth/jwt"{
    interface JWT{
      banned?:boolean
    }
 }

 // Fix for missing types in Web Speech API
declare global {
  interface SpeechRecognition extends EventTarget {
    start(): void;
    stop(): void;
    abort(): void;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onaudioend: (event: Event) => void;
    onaudiostart: (event: Event) => void;
    onend: (event: Event) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onnomatch: (event: SpeechRecognitionEvent) => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onsoundend: (event: Event) => void;
    onsoundstart: (event: Event) => void;
    onspeechend: (event: Event) => void;
    onspeechstart: (event: Event) => void;
    onstart: (event: Event) => void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
    SpeechRecognition: typeof SpeechRecognition;
  }
}
interface Window {
  webkitAudioContext: typeof AudioContext;
}