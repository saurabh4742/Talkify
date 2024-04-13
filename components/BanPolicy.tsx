import { BanAnimation } from '@/Lottie/BanAnimation'
import React from 'react'

const BanPolicy = () => {
  return (
    <div id='banpolicies' className='text-[#14532D] text-center p-2  w-full flex justify-center'>
    <div className="flex-col "><span className='text-4xl font-extrabold border-b-2 '>Ban Policies</span>
    {/* <div className='w-full flex justify-center'><div className='sm:w-3/12 w-full'><BanAnimation/></div></div> */}
    <div className="sm:flex my-4 w-full flex-none text-center px-4 sm:justify-between">
    <div className="sm:w-4/12 w-full  space-y-3 ">
        <p className="text-2xl font-bold">Toxic Speech</p>
        <div className="flex justify-center"><p className="sm:w-8/12 w-full">We maintain a zero-tolerance policy towards toxic speech. Any user found engaging in such behavior will face immediate suspension or permanent ban from the platform. Let&apos;s uphold a respectful and welcoming environment for all.</p></div>
    </div>
    <div className="sm:w-4/12 w-full   space-y-3">
        <p className="text-2xl font-bold">Promoting Vulgarity</p>
        <div className="flex justify-center"><p className="sm:w-8/12 w-full">Promoting nudity or explicit content is strictly prohibited. Users found violating this policy will be swiftly banned from the platform. Help us maintain a safe and family-friendly environment for everyone.</p></div>
    </div>
    <div className="sm:w-4/12 w-full    space-y-3">
        <p className="text-2xl font-bold">Racist Comments</p>
        <div className="flex justify-center"><p className="sm:w-8/12 w-full">We have a strict stance against racist comments. Any user found making such remarks will be subject to immediate banning. Let&apos;s foster an inclusive and respectful community where everyone feels valued and accepted.</p></div>
    </div>
</div>

    </div>
    </div>
  )
}

export default BanPolicy
