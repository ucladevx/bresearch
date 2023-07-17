import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

function AccountType() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function createStudent() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/student/create', { method: 'POST' });
      if (res.status === 200) {
        await getSession(); // calls jwt callback to update accountType
        await router.push('/student/profile/create');
      } else if (res.status === 500) {
        const responseBody = await res.json();
        if (responseBody?.message?.startsWith('Student al')) {
          await getSession(); // calls jwt callback to update accountType
          await router.push('/');
        }
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  async function createResearcher() {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/researcher/create', { method: 'POST' });
      if (res.status === 200) {
        // await getSession(); // calls jwt callback to update accountType
        // await router.push('/researcher/profile/create');
      } else if (res.status === 500) {
        const responseBody = await res.json();
        if (responseBody?.message?.startsWith('Researcher al')) {
          await getSession(); // calls jwt callback to update accountType
          await router.push('/');
        }
      }
    } catch (e) {}
    setIsSubmitting(false);
  }

  return (
    <div>
      <img src="/bResearchLogo.png" className="w-1/4 mx-auto my-20" />
      <button
        className="ml-60 w-1/3 h-60 bg-blue-800 text-white text-2xl font-normal rounded-md cursor-pointer disabled:opacity-75"
        onClick={() => createStudent()}
        disabled={isSubmitting}
      >
        I am a student looking for research
        <br />
        <br />
        <span className="font-bold">Create a Student Account</span>
      </button>
      <button
        className="ml-10 w-1/3 h-60 bg-blue-800 text-white text-2xl font-normal rounded-md cursor-pointer disabled:opacity-75"
        disabled={isSubmitting}
      >
        I am a PI looking to hire students
        <br />
        <br />
        <span className="font-bold">Create a PI Account</span>
      </button>
    </div>
  );
}

export default AccountType;
