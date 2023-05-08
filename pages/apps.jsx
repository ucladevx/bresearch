//TODO: Menu (tailwind?), logos, application dates
import { useState, useEffect } from 'react';
import Link from 'next/link';

const AppCard = (props) => {
  const { apps } = props;
  return (
    <Link href={`/job/${apps.id}`}>
      <ul
        className={'w-11/12 h-1/3 mx-auto min-h-max p-6 rounded-lg shadow-sm border my-4'}
        key={apps.id}
      >
        <li>{apps.title}</li>
        <li>{'Placeholder Date'}</li>
      </ul>
    </Link>
  );
};

const AppWrapper = (props) => {
  const { apps, type } = props;
  return (
    <div
      className="bg-white w-11/12 h-full p-4 rounded-lg shadow-md items-center justify-center"
      style={{ overflowY: 'scroll' }}
    >
      <h1>{type}</h1>
      {apps.map((apps) => (
        <AppCard key={apps.id} apps={apps} />
      ))}
    </div>
  );
};

//Saved vs applied jobs
export default function Apps() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetch('/api/applications', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => setApps(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let appliedApps = apps.filter((job) => {
    return job.status == 'APPLIED';
  });
  let savedApps = apps.filter((job) => {
    return job.status == 'SAVED';
  });

  return (
    <div className="bg-neutral-100">
      <header>
        <nav>{/*NavBar*/}</nav>
      </header>
      <h1>App Tracker</h1>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div className=" grid grid-cols-2 h-4/6 w-11/12 gap-x-42 justify-items-center">
          <AppWrapper apps={savedApps} type={'Saved'} />
          <AppWrapper apps={appliedApps} type={'Applied'} />
        </div>
      </div>
    </div>
  );
}
