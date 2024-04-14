import { NotfoundPageAnimation } from '@/Lottie/NotFound'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex justify-center h-[90vh] items-center'>
      <div className='flex flex-col gap-4 justify-center items-center h-[90vh] text-center'>
    <h1 className='text-foregroundPink font-extrabold text-5xl' ><span className='font-light '>404</span> Page Not Found</h1>
      <Link className='text-foregroundPink font-extrabold text-2xl ' href="/">Return Home</Link>
      </div>
      
    </div>
  )
}