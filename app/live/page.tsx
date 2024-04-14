import LIveKItRTCComponent from '@/components/LIveKItRTCComponent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SendHorizontal } from 'lucide-react'
import React from 'react'

const Live = () => {
  return (
    <div className='w-full sm:h-[90vh] bg-white sm:flex space-y-4  justify-center p-2 text-3xl '>
      <div className='sm:h-full  sm:w-4/12 p-2  flex flex-col justify-between gap-4  items-center'>
      <LIveKItRTCComponent/>
        {/* <div className=' bg-background  shadow-lg rounded-2xl sm:h-full sm:w-full'> <LIveKItRTCComponent/></div> */}
      </div>
      <div className='sm:h-full sm:w-8/12  flex flex-col bg-background shadow-lg rounded-2xl p-2 justify-between  items-center'>
      <div className='hidden  text-lg overflow-auto w-full p-4 gap-4  sm:flex flex-col justify-center items-center '>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      <p className='w-full flex justify-start items-center'><span className='text-red-600 '>Random:</span>Ami Tumake Bhalo basi</p>
      <p className='w-full flex justify-Start  items-center'><span className='text-primary '>You:</span>Ek to pori</p>
      </div>
      <div className='w-full h-2/6 flex justify-between items-center p-2 gap-2'><Button size="lg" >Next</Button><div className='w-full relative flex justify-between items-center '><Input  placeholder='Chat Now...'/><Button className='absolute  right-0 p-2 rounded-xl ' variant="outline"><SendHorizontal/></Button></div></div>
      </div>
    </div>
  )
}

export default Live
