"use client"
import { ModeToggle } from '@/Theme/ThemeToggler'
import React from 'react'
import Image from 'next/image'
import src from '../../public/LogoTalkify.png'
import { Button } from '../ui/button'
import { LogIn, LogOut} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession ,signOut} from 'next-auth/react'
import Logo from '../Logo'
const Navbar = () => {
  const session=useSession();
  const router=useRouter();
  return (
    <div className='flex  justify-between border-b-2  items-center  p-2 shadow-md w-full'>
      <Logo/>
      <div className='sm:flex hidden'><div className='sm:flex justify-center gap-2'>
      <Button onClick={()=>{
        router.push("/")
      }}  className=' text-base ' variant="link" size="lg">Home</Button>
      </div>
      </div>
      {session.data?.user ?<Button onClick={async()=>{
        await signOut()
      }} > <LogOut  className='h-5 w-5 mr-2' />Logout</Button> :<Button onClick={()=>{
        router.push("/auth/login")
      }} > <LogIn  className='h-5 w-5 mr-2' />Login</Button>}
    </div>
  )
}

export default Navbar
