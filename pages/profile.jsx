import { useState, useEffect } from 'react';
import ResearcherSidebar from '../components/ResearcherSidebar';
import Head from 'next/head';
import { signOut } from 'next-auth/react';

function ResearcherProfile() {
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    async function getProfileInfo() {
      try {
        const profileInfo = await (await fetch('/api/researcher/profile')).json();
        setProfileInfo(profileInfo);
      } catch (e) {}
    }
    getProfileInfo();
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <ResearcherSidebar />
      <div className="bg-light-gray">
        <main className="min-h-screen ml-[15.5rem] flex flex-col  pl-10 max-w-[68.5rem] gap-y-10">
          {
            <>
              <div className="mt-[6.75rem] h-[12.25rem] bg-white rounded-[1.25rem] flex items-center justify-between p-12">
                {profileInfo !== null && (
                  <>
                    <div className="flex gap-x-12 h-full items-center flex-wrap">
                      <div className="w-[6.25rem] h-full bg-dark-blue rounded-[50%]"></div>
                      <div className="font-bold text-[2rem] leading-10">
                        {profileInfo.researcherProfile.name}
                      </div>
                    </div>
                    <button className="invisible">Edit</button>
                  </>
                )}
              </div>
              <div className="bg-white rounded-[1.25rem] flex gap-y-2">
                {profileInfo !== null &&
                  profileInfo.labs.map(({ name, id }) => (
                    <div key={id} className="flex flex-col p-12">
                      <div className="flex flex-col gap-2">
                        <div className="font-bold">Lab</div>
                        <div>{name}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          }
          <div className="flex justify-end">
            <button
              className="py-4 px-9 border-[#E53939] border-[1px] rounded-xl text-[#E53939] font-semibold text-base"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default ResearcherProfile;
