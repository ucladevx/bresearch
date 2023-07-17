import React from 'react';
import Image from 'next/image';

function OnboardingPage() {
  return (
    <div className="grid grid-cols-1 justify-items-center">
      <img src="/bResearchLogo.png" className="w-1/2 mx-auto my-8" />
      <div className="w-1/2">
        <form className="bg-white rounded-lg backdrop-blur-md border border-solid border-white/10 shadow-lg p-8 flex flex-col justify-center items-left bg-opacity-60 my-20">
          <center>
            <h1 className="text-2xl font-bold mt-0 rounded-sm py-1 px-1 text-blue-800">
              Getting Started
            </h1>
          </center>

          <label className="block mt-4 text-lg leading-9 text-left text-black">Lab</label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label className="block mt-4 text-lg leading-9 text-left text-black">Area</label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label className="block mt-4 text-lg leading-9 text-left text-black">Name</label>
          <input
            type="text"
            className="w-full h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label className="block mt-4 text-lg leading-9 text-left text-black">
            Lab Contact Email Address
          </label>
          <input
            type="text"
            className="w-full h-8 mb-6 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <div className="flex justify-center">
            <button className="w-40 bg-blue-800 text-white py-3 text-lg font-semibold rounded-md cursor-pointer">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OnboardingPage;
