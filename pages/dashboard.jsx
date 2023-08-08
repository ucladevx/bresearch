import { useState, useEffect } from 'react';
import ResearcherSidebar from '../components/ResearcherSidebar';
import ResearcherPostCard from '../components/ResearcherPostCard';
import Head from 'next/head';

function Dashboard() {
  const [dashboardInfo, setDashboardInfo] = useState(null);

  useEffect(() => {
    async function getDashboardInfo() {
      try {
        const dashboardInfo = await (await fetch('/api/researcher/dashboard')).json();
        setDashboardInfo(dashboardInfo);
      } catch (e) {}
    }
    getDashboardInfo();
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <ResearcherSidebar />
      <main className="min-h-screen ml-[15.5rem] flex flex-col bg-light-gray pl-10">
        {dashboardInfo === null ? (
          <>
            <h1 className="mt-16 font-semibold text-[2rem] leading-10">Hello</h1>
            <div className="mt-9 flex gap-7 flex-wrap">
              {[null, null, null, null].map((_, i) => (
                <div className="h-52 w-64 text-center bg-white rounded-[1.25rem]" key={i} />
              ))}
            </div>
            <div className="mt-12">
              <h2 className="font-bold text-2xl">Open Positions</h2>
              <div className="mt-9 flex flex-col gap-3" />
            </div>
          </>
        ) : (
          <>
            <h1 className="mt-16 font-semibold text-[2rem] leading-10">
              Hello {dashboardInfo.name}
            </h1>
            <div className="mt-9 flex gap-7 flex-wrap">
              {
                <>
                  <div className="h-52 w-64 text-center bg-white rounded-[1.25rem]">
                    {/* TODO: find better way to do below */}
                    <span className="text-4xl font-medium mt-12 inline-block text-[#404040]">
                      {dashboardInfo.newApplicationCount}
                    </span>
                    <br />
                    <span className="text-2xl font-semibold mt-9 inline-block">
                      New Applications
                    </span>
                  </div>
                  <div className="h-52 w-64 text-center bg-white rounded-[1.25rem]">
                    {/* TODO: find better way to do below */}
                    <span className="text-4xl font-medium mt-12 inline-block text-[#404040]">
                      {dashboardInfo.totalApplicationCount}
                    </span>
                    <br />
                    <span className="text-2xl font-semibold mt-9 inline-block">
                      Total Applications
                    </span>
                  </div>
                  <div className="h-52 w-64 text-center bg-white rounded-[1.25rem]">
                    {/* TODO: find better way to do below */}
                    <span className="text-4xl font-medium mt-12 inline-block text-[#404040]">
                      {dashboardInfo.activePosts.length}
                    </span>
                    <br />
                    <span className="text-2xl font-semibold mt-9 inline-block">Active Posts</span>
                  </div>
                  <div className="h-52 w-64 text-center bg-white rounded-[1.25rem]">
                    {/* TODO: find better way to do below */}
                    <span className="text-4xl font-medium mt-12 inline-block text-[#404040]">
                      {dashboardInfo.totalPostCount}
                    </span>
                    <br />
                    <span className="text-2xl font-semibold mt-9 inline-block">Total Posts</span>
                  </div>
                </>
              }
            </div>
            <div className="mt-12">
              <h2 className="font-bold text-2xl">Open Positions</h2>
              <div className="mt-9 flex flex-col gap-3 mb-3">
                {dashboardInfo.activePosts.length === 0 ? (
                  <div>You have no active posts.</div>
                ) : (
                  dashboardInfo.activePosts.map(
                    ({ id, lab: { name: labName }, title, closingDate }) => (
                      <ResearcherPostCard
                        key={id}
                        id={id}
                        labName={labName}
                        title={title}
                        closingDate={closingDate}
                      />
                    )
                  )
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Dashboard;
