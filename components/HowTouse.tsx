import React from "react";

export const HowTouse = () => {
  return (
    <div id="howtouse" className="bg-backgroundPink py-20 bg-[#F0FDF4]  sm:items-center rounded-br-3xl rounded-tl-3xl text-[#14532D]  p-4 w-full space-y-4 space justify-center">
      <div className="flex w-full justify-center">
        <span className="text-4xl border-b-2   font-extrabold ">
          User Guide
        </span>
      </div>
      
<div className="sm:flex w-full flex-none  text-center px-4 sm:justify-between">
    <div className="sm:w-4/12 w-full my-2  space-y-3 ">
        <p className="text-2xl font-bold">First Step</p>
      <div className="flex justify-center"> <p className="sm:w-8/12 w-full">Begin your journey by navigating to the upper right corner of the screen, where you&apos;ll find the Login Button eagerly awaiting your click. Simply tap or click on it to proceed.</p></div>
    </div>
    <div className="sm:w-4/12 w-full  my-2 space-y-3">
        <p className="text-2xl font-bold">Second Step</p>
        <div className="flex justify-center"><p className="sm:w-8/12 w-full">Once logged in, direct your attention to the center of the screen, where you&apos;ll spot the enticing Random Match Button. Give it a click to initiate the magic of connecting with a random counterpart.</p></div>
    </div>
    <div className="sm:w-4/12 w-full my-2   space-y-3">
        <p className="text-2xl font-bold">Last Step</p>
        <div className="flex justify-center"><p className="sm:w-8/12 w-full">With the first two steps accomplished, you&apos;ve arrived at the final leg of your journey. Engage in meaningful interactions either through the chat section or elevate your connection through a video call.</p></div>
    </div>
</div>
    </div>
  );
};
