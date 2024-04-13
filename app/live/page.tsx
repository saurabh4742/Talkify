import React from 'react'

const Live = () => {
  return (
    <div className='w-full sm:h-[90vh] bg-white flex justify-center p-2 text-3xl '>
      <div className='sm:h-full  sm:w-4/12 p-2  flex flex-col justify-between gap-4  items-center'>
        <div className=' bg-backgroundGreen shadow-lg rounded-2xl sm:h-full  sm:w-full'></div>
        <div className=' bg-backgroundGreen shadow-lg rounded-2xl sm:h-full sm:w-full'> </div>
      </div>
      <div className='sm:h-full sm:w-8/12 flex flex-col bg-background shadow-lg rounded-2xl justify-evenly  items-center'>

      </div>
    </div>
  )
}

export default Live
