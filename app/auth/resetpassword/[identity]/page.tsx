
"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import {z} from"zod"
import { NewPasswordFormSchema } from '@/ZodSchema/FormSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
const page = ({ params }: { params: { identity: string } }) => {
    const id=params.identity;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [success,setSuccesss]=useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router=useRouter();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const form = useForm<z.infer<typeof NewPasswordFormSchema>>({
      resolver: zodResolver(NewPasswordFormSchema),
      defaultValues: {
        password: ""
      },
    })
      async function onSubmit(values: z.infer<typeof NewPasswordFormSchema>) {
        try {
          setSuccesss(false);
          const res=await axios.post("/api/passwordreset",{id,newpassword:values.password});
          setSuccesss(true);
          toast.success(res.data.message)
          router.push("/auth/login")
        } catch (error) {
          setSuccesss(false);
          toast.error("Server issue,Try after some time")
        }
        
      }
      if(success){
        return <><div className='flex h-[100vh] justify-center items-center gap-4'>
          🔑 A password reset link has been sent.Please check your mail.
          </div></>
      }
    else{
      return (
        <div className='flex h-[100vh] justify-center items-center'>
          <Card className='sm:w-3/12 w-full m-2 '>
            <CardHeader className='font-bold justify-center flex items-center'>
              Reset Password
            </CardHeader>
            <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
          <div className='flex justify-center w-full'><Button disabled={success} className='w-full' size="lg" type="submit">{success?<div className='animate-spin '><Loader2/></div>:<>Update</>}</Button></div>
          </form>
        </Form>
        </CardContent>
          </Card>
        </div>
      )
    }
    
  }
  
  export default page