
"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import {z} from"zod"
import { ResetFormSchema } from '@/ZodSchema/FormSchema'
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
import { RedirectToSignup } from '@/serveractions/Redirect'
import axios from 'axios'
const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mailsent,setMailSent]=useState(false)
  // eslint-disable-next-line react-hooks/rules-of-hooks
    const onClick=()=>{
        RedirectToSignup();
    }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: ""
    },
  })
    async function onSubmit(values: z.infer<typeof ResetFormSchema>) {
      try {
        setMailSent(false);
        const res=await axios.post("/api/sendmail",{email:values.email});
        setMailSent(true);
      } catch (error) {
        setMailSent(false);
        toast.error("Server issue Or Wrong Email")
      }
      
    }
    if(mailsent){
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        
        <div className='flex justify-center w-full'><Button className='w-full' size="lg" type="submit">Reset</Button></div>
        </form>
      </Form>
      </CardContent>
          <CardDescription className=' flex justify-center'>
            <Button  variant="link" onClick={onClick
              
            } >Create an account</Button>
          </CardDescription>
        </Card>
      </div>
    )
  }
  
}

export default page
