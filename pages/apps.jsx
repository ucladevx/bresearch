import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircleIcon, BookmarkIcon } from '@heroicons/react/20/solid';
import AppsDropdown from '../components/AppsDropdown';
import NavBar from '../components/NavBar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

//Card for each application
const AppCard = ({ app, index }) => {
  return (
    <Draggable draggableId={app.job.id.toString()} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <ul className="w-11/12 h-1/3 mx-auto min-h-max p-6 rounded-lg shadow-sm border my-4">
            <li className="flex justify-end -mr-4 -mt-4">
              <AppsDropdown jobId={app.job.id} />
            </li>
            <Link href={`/job/${app.job.id}`}>
              <li className="font-semibold">{app.job.title}</li>
            </Link>
            <li className="text-xs font-normal">{'Placeholder Date'}</li>
          </ul>
        </div>
      )}
    </Draggable>
  );
};

//Wrapper for Saved and Applied tabs
const AppWrapper = ({ apps, type }) => {
  return (
    <div className="overflow-y-auto bg-white w-11/12 h-full p-4 rounded-lg shadow-md items-center justify-center">
      <h1 className="flex flex-row font-bold">
        {type === 'Saved' ? (
          <BookmarkIcon className="ml-2 w-9 px-2 text-indigo-800" />
        ) : (
          <CheckCircleIcon className="ml-2 w-9 px-2 text-lime-600" />
        )}
        {type}
      </h1>
      <Droppable droppableId={type}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {apps.map((app, index) => (
              <AppCard key={app.job.id} app={app} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
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

  const onDragEnd = (result) => {
    console.log(result); // Add a console log to check the result
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }
    // If dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Find the source and destination columns
    const sourceColumn = source.droppableId === 'Saved' ? savedApps : appliedApps;
    const destinationColumn = destination.droppableId === 'Saved' ? savedApps : appliedApps;

    // Remove item from source column
    const [movedApp] = sourceColumn.splice(source.index, 1);
    movedApp.status = destination.droppableId === 'Saved' ? 'SAVED' : 'APPLIED';

    // Add item to destination column
    destinationColumn.splice(destination.index, 0, movedApp);

    // Update state with new columns
    setApps(
      apps.map((app) =>
        app.job.id === movedApp.job.id ? { ...app, status: movedApp.status } : app
      )
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

  // Hardcoded cards for Saved and Applied
  const hardcodedSavedCards = [
    {
      job: {
        id: 1,
        title: 'Saved Job 1',
      },
    },
    {
      job: {
        id: 2,
        title: 'Saved Job 2',
      },
    },
  ];

  const hardcodedAppliedCards = [
    {
      job: {
        id: 3,
        title: 'Applied Job 1',
      },
    },
    {
      job: {
        id: 4,
        title: 'Applied Job 2',
      },
    },
  ];

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
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-2 -mt-32 h-4/6 w-11/12 gap-x-42 relative justify-items-center">
            <AppWrapper
              // apps={savedApps}
              apps={[...hardcodedSavedCards, ...savedApps]} // Combine hardcoded and fetched data
              type="Saved"
              markApplied={markApplied}
              removeJob={removeJob}
            />
            <AppWrapper
              // apps={appliedApps}
              apps={[...hardcodedAppliedCards, ...appliedApps]} // Combine hardcoded and fetched data
              type="Applied"
              removeJob={removeJob}
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
