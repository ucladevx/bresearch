import React from 'react';
import Image from 'next/image';

function accountType() {
  return (
    <div>
      <img src="/bResearchLogo.png" className="w-1/4 mx-auto my-20" />
      <button className=" ml-60 w-1/3 h-60 bg-blue-800 text-white text-2xl font-normal rounded-md cursor-pointer">
        I am a student looking for research
        <br />
        <br />
        <span className="font-bold">Create a Student Account</span>
      </button>
      <button className=" ml-10 w-1/3 h-60 bg-blue-800 text-white text-2xl font-normal rounded-md cursor-pointer">
        I am a PI looking to hire students
        <br />
        <br />
        <span className="font-bold">Create a PI Account</span>
      </button>
    </div>
  );
}

export default accountType;
