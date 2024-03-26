import { NotfoundPageAnimation } from '@/Lottie/NotFound'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex justify-center'>
      <div className='space-y-1 text-center'>
    <NotfoundPageAnimation/>
      <Link className='text-foregroundPink font-extrabold text-3xl ' href="/">Return Home</Link>
      </div>
      
    </div>
  )
}