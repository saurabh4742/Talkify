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
export function YouAreBanned() {
  const router=useRouter()
  return (
    <div>
      <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-900">Your Account is Banned</AlertDialogTitle>
          <AlertDialogDescription >
            Your account has been banned due to inappropriate behavior on the
            app. As a result, your account will be deactivated, and all
            associated data will be removed from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="ghost" onClick={()=>{
            router.push("/start")
          }}>Back To Home</Button>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Customer Support<PiHeadphonesBold/></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    
  );
}
