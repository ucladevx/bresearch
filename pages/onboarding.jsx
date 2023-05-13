import React from 'react';
import Image from 'next/image';

function onboardingPage() {
  return (
    <div>
      <img src="/bResearchLogo.png" class="w-1/2 mx-auto my-8" />
      <div>
        <form class="h-85 w-1/2 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg backdrop-blur-md border border-solid border-white/10 shadow-lg py-20 px-14 flex flex-col justify-center items-left bg-opacity-60 my-20">
          <center>
            <h1 class="text-2xl font-bold mt-0 rounded-sm py-1 px-1 text-blue-800">
              Getting Started
            </h1>
          </center>

          <label class="block mt-2 text-lg leading-9 text-left text-black">Lab</label>
          <input
            type="text"
            class="w-97 h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label class="block mt-2 text-lg leading-9 text-left text-black">Area</label>
          <input
            type="text"
            class="w-97 h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label class="block mt-2 text-lg leading-9 text-left text-black">Name</label>
          <input
            type="text"
            class="w-97 h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <label class="block mt-2 text-lg leading-9 text-left text-black">
            Lab Contact Email Address
          </label>
          <input
            type="text"
            class="w-97 h-8 mb-2 pb-2 text-black bg-white border border-black rounded-sm pl-2 pt-1"
          />

          <button class="mt-10 ml-60 w-40 bg-blue-800 text-white py-3 px-0 text-lg font-semibold rounded-md cursor-pointer">
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default onboardingPage;
