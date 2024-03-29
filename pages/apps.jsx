import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircleIcon, BookmarkIcon } from '@heroicons/react/20/solid';
import AppsDropdown from '../components/AppsDropdown';
import NavBar from '../components/NavBar';
//TODO: Fix menu not overlapping
//Should text or card resize for longer/shorter titles?

//Card for each application
const AppCard = (props) => {
  const { apps, markApplied, removeJob, type } = props;
  return (
    <div>
      <ul
        className="w-11/12 h-1/3 mx-auto min-h-max p-6 rounded-lg shadow-sm border my-4"
        key={apps.job.id}
      >
        <li className="flex justify-end -mr-4 -mt-4">
          <AppsDropdown
            jobId={apps.job.id}
            markApplied={markApplied}
            removeJob={removeJob}
            type={type}
          />
        </li>
        <Link href={`/job/${apps.job.id}`}>
          <li className="font-semibold">{apps.job.title}</li>
        </Link>
        {/*TODO: Change date info when updated in prisma */}
        <li className="text-xs font-normal">{'Placeholder Date'}</li>
      </ul>
    </div>
  );
};

//Wrapper for Saved and Applied tabs
const AppWrapper = (props) => {
  const { apps, type, markApplied, removeJob } = props;

  return (
    <div className="overflow-y-auto bg-white w-11/12 h-full p-4 rounded-lg shadow-md items-center justify-center">
      {/*Changes icon depending on Saved or Applied */}
      <h1 className="flex flex-row font-bold ">
        {type === 'Saved' ? (
          <BookmarkIcon className="ml-2 w-9 px-2 text-indigo-800" />
        ) : (
          <CheckCircleIcon className="ml-2 w-9 px-2 text-lime-600" />
        )}
        {type}
      </h1>
      {/*Maps applications to AppCards to display */}
      {apps.map((apps) => (
        <AppCard
          key={apps.job.id}
          apps={apps}
          markApplied={markApplied}
          removeJob={removeJob}
          type={type}
        />
      ))}
    </div>
  );
};

//Saved vs applied jobs
export default function Apps() {
  const [apps, setApps] = useState([]);
  const appliedApps = apps.filter((job) => job.status === 'APPLIED');
  const savedApps = apps.filter((job) => job.status === 'SAVED');

  useEffect(() => {
    fetch('/api/applications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApps(data);
      })
      .catch((error) => {
        console.log(error);
      });
    //Reloading apps so that if user changes status it updates
  }, []);

  const markApplied = (jobId) => {
    setApps(
      apps.map((app) => {
        if (app.job.id !== jobId) {
          return app;
        }
        return { ...app, status: 'APPLIED' };
      })
    );
  };

  const removeJob = (jobId) => {
    setApps(
      apps.map((app) => {
        if (app.job.id !== jobId) {
          return app;
        }
        return { ...app, status: 'HIDDEN' };
      })
    );
  };

  return (
    <div className="fixed bg-neutral-100 h-screen w-screen">
      <Head>
        <title>Manage Apps</title>
      </Head>
      <header>
        <NavBar pathname="/apps" />
      </header>
      <h1 className="text-2xl font-bold flex justify-center mt-6">App Tracker</h1>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        {/*Display Saved and Applied tabs next to each other */}
        <div className="grid grid-cols-2 -mt-32 h-4/6 w-11/12 gap-x-42 relative justify-items-center">
          <AppWrapper
            apps={savedApps}
            type="Saved"
            markApplied={markApplied}
            removeJob={removeJob}
          />
          <AppWrapper apps={appliedApps} type="Applied" removeJob={removeJob} />
        </div>
      </div>
    </div>
  );
}
