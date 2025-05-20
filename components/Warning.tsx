"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {PiHeadphonesBold } from "react-icons/pi";
import { string } from "zod";
export function Warning({ num, onClose }: { num: number; onClose: () => void }) {
  const messages = [
    "We noticed inappropriate language in your conversation. Please be respectful. Continued misuse may lead to account action.",
    "This is your second warning for using inappropriate language. One more violation will result in a temporary ban.",
    "This is your final warning. Any further inappropriate behavior will result in an immediate account ban.",
  ];
  
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-900">Warning {num}/3</AlertDialogTitle>
          <AlertDialogDescription className="font-bold">
            {messages[num - 1]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onClose}>I Agree to Terms</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

