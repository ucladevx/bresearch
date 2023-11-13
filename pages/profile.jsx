import { useState, useEffect } from 'react';
import ResearcherSidebar from '../components/ResearcherSidebar';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import { Departments } from '@lib/globals';

function ResearcherProfile() {
  const [profileInfo, setProfileInfo] = useState(null);
  const [showPicture, setShowPicture] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    setShowPicture(localStorage.getItem('showPicture') === 'true');

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
                      {showPicture && session?.user?.image ? (
                        <img
                          src={session.user.image}
                          // width={48}
                          // height={48}
                          alt="Your Profile Picture"
                          className="rounded-[50%]"
                          referrerPolicy="no-referrer"
                          // https://stackoverflow.com/questions/40570117/http403-forbidden-error-when-trying-to-load-img-src-with-google-profile-pic
                        />
                      ) : (
                        // <div className="w-[6.25rem] h-full bg-dark-blue rounded-[50%]"></div>
                        <svg
                          // width="50"
                          // height="50"
                          height="auto"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M45.8334 25C45.8334 13.5208 36.4792 4.16663 25.0001 4.16663C13.5209 4.16663 4.16675 13.5208 4.16675 25C4.16675 31.0416 6.77091 36.4791 10.8959 40.2916C10.8959 40.3125 10.8959 40.3125 10.8751 40.3333C11.0834 40.5416 11.3334 40.7083 11.5417 40.8958C11.6667 41 11.7709 41.1041 11.8959 41.1875C12.2709 41.5 12.6876 41.7916 13.0834 42.0833C13.2292 42.1875 13.3542 42.2708 13.5001 42.375C13.8959 42.6458 14.3126 42.8958 14.7501 43.125C14.8959 43.2083 15.0626 43.3125 15.2084 43.3958C15.6251 43.625 16.0626 43.8333 16.5209 44.0208C16.6876 44.1041 16.8542 44.1875 17.0209 44.25C17.4792 44.4375 17.9376 44.6041 18.3959 44.75C18.5626 44.8125 18.7292 44.875 18.8959 44.9166C19.3959 45.0625 19.8959 45.1875 20.3959 45.3125C20.5417 45.3541 20.6876 45.3958 20.8542 45.4166C21.4376 45.5416 22.0209 45.625 22.6251 45.6875C22.7084 45.6875 22.7917 45.7083 22.8751 45.7291C23.5834 45.7916 24.2917 45.8333 25.0001 45.8333C25.7084 45.8333 26.4167 45.7916 27.1042 45.7291C27.1876 45.7291 27.2709 45.7083 27.3542 45.6875C27.9584 45.625 28.5417 45.5416 29.1251 45.4166C29.2709 45.3958 29.4167 45.3333 29.5834 45.3125C30.0834 45.1875 30.6042 45.0833 31.0834 44.9166C31.2501 44.8541 31.4167 44.7916 31.5834 44.75C32.0417 44.5833 32.5209 44.4375 32.9584 44.25C33.1251 44.1875 33.2917 44.1041 33.4584 44.0208C33.8959 43.8333 34.3334 43.625 34.7709 43.3958C34.9376 43.3125 35.0834 43.2083 35.2292 43.125C35.6459 42.875 36.0626 42.6458 36.4792 42.375C36.6251 42.2916 36.7501 42.1875 36.8959 42.0833C37.3126 41.7916 37.7084 41.5 38.0834 41.1875C38.2084 41.0833 38.3126 40.9791 38.4376 40.8958C38.6667 40.7083 38.8959 40.5208 39.1042 40.3333C39.1042 40.3125 39.1042 40.3125 39.0834 40.2916C43.2292 36.4791 45.8334 31.0416 45.8334 25ZM35.2917 35.3541C29.6459 31.5625 20.3959 31.5625 14.7084 35.3541C13.7917 35.9583 13.0417 36.6666 12.4167 37.4375C9.25008 34.2291 7.29175 29.8333 7.29175 25C7.29175 15.2291 15.2292 7.29163 25.0001 7.29163C34.7709 7.29163 42.7084 15.2291 42.7084 25C42.7084 29.8333 40.7501 34.2291 37.5834 37.4375C36.9792 36.6666 36.2084 35.9583 35.2917 35.3541Z"
                            fill="#1E2F97"
                          />
                          <path
                            d="M25 14.4375C20.6875 14.4375 17.1875 17.9375 17.1875 22.25C17.1875 26.4792 20.5 29.9167 24.8958 30.0417C24.9583 30.0417 25.0417 30.0417 25.0833 30.0417C25.125 30.0417 25.1875 30.0417 25.2292 30.0417C25.25 30.0417 25.2708 30.0417 25.2708 30.0417C29.4792 29.8958 32.7917 26.4792 32.8125 22.25C32.8125 17.9375 29.3125 14.4375 25 14.4375Z"
                            fill="#1E2F97"
                          />
                        </svg>
                      )}
                      <div className="font-bold text-[2rem] leading-10">
                        {`${profileInfo.researcherProfile.firstName} ${profileInfo.researcherProfile.lastName}`}
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
