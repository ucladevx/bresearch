import prisma from '@lib/prisma';

import { useState, Fragment, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { BookmarkIcon } from '@heroicons/react/20/solid';
import NavBar from '../components/NavBar';

function JobCard({
  id,
  title,
  location,
  duration,
  departments,
  labName,
  setSelectedJob,
  updateJob,
  isSelectedJob,
  toast,
}) {
  // Mutations
  const mutation = useMutation({
    mutationFn: async () => {
      return await (
        await fetch(`/api/applications/${id}/save`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
      ).json();
    },
    onSettled: (data) => {
      if (data?.saved) {
        updateJob();
      }
    },
  });
  return (
    <div
      className={
        'flex flex-col p-9 bg-white text-black gap-4 rounded-[20px]' +
        (isSelectedJob ? ' border-4 border-light-blue' : '')
      }
      onClick={setSelectedJob}
    >
      <div className="flex justify-between">
        <div className="text-base font-medium">{labName}</div>
        {mutation.isLoading ? (
          <button
            disabled={true}
            className="w-6 flex items-center justify-center"
            aria-label="Loading"
          >
            {/* TODO: change below to loading icon */}
            <svg
              width="26"
              height="29"
              viewBox="0 0 26 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.875 2H6.825C4.1625 2 2 4.175 2 6.825V24.4375C2 26.6875 3.6125 27.6375 5.5875 26.55L11.6875 23.1625C12.3375 22.8 13.3875 22.8 14.025 23.1625L20.125 26.55C22.1 27.65 23.7125 26.7 23.7125 24.4375V6.825C23.7 4.175 21.5375 2 18.875 2Z"
                stroke="#1E2F97"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            aria-label="Save job"
            className="flex items-center w-6"
            onClick={(e) => {
              mutation.mutate();
              e.stopPropagation();
            }}
          >
            <svg
              width="26"
              height="29"
              viewBox="0 0 26 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.875 2H6.825C4.1625 2 2 4.175 2 6.825V24.4375C2 26.6875 3.6125 27.6375 5.5875 26.55L11.6875 23.1625C12.3375 22.8 13.3875 22.8 14.025 23.1625L20.125 26.55C22.1 27.65 23.7125 26.7 23.7125 24.4375V6.825C23.7 4.175 21.5375 2 18.875 2Z"
                stroke="#1E2F97"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="font-semibold text-xl">{title}</div>
      <ul className="flex font-medium text-sm">
        <li className="px-[.625rem] py-2 bg-[#D8F9C4] rounded-[30px]">
          {locations.find(({ value }) => value === location).label}
        </li>
      </ul>
    </div>
  );
}

function SavedJobCard({
  id,
  title,
  location,
  duration,
  departments,
  labName,
  setSelectedJob,
  updateJob,
  isSelectedJob,
  toast,
}) {
  // Mutations
  const mutation = useMutation({
    mutationFn: async () => {
      return await (
        await fetch(`/api/applications/${id}/unsave`, {
          method: 'DELETE',
        })
      ).json();
    },
    onSettled: (data) => {
      if (data?.unsaved) {
        updateJob();
      }
    },
  });
  return (
    <div
      className={
        'flex flex-col p-9 bg-white text-black gap-4 rounded-[20px]' +
        (isSelectedJob ? ' border-4 border-light-blue' : '')
      }
      onClick={setSelectedJob}
    >
      <div className="flex justify-between">
        <div className="text-base font-medium">{labName}</div>
        {mutation.isLoading ? (
          <button
            disabled={true}
            className="w-6 flex items-center justify-center"
            aria-label="Loading"
          >
            {/* TODO: change below to loading icon */}
            <svg
              width="26"
              height="29"
              viewBox="0 0 26 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.875 2H6.825C4.1625 2 2 4.175 2 6.825V24.4375C2 26.6875 3.6125 27.6375 5.5875 26.55L11.6875 23.1625C12.3375 22.8 13.3875 22.8 14.025 23.1625L20.125 26.55C22.1 27.65 23.7125 26.7 23.7125 24.4375V6.825C23.7 4.175 21.5375 2 18.875 2Z"
                fill="#1E2F97"
                stroke="#1E2F97"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button
            aria-label="Save job"
            className="flex items-center w-6"
            onClick={(e) => {
              mutation.mutate();
              e.stopPropagation();
            }}
          >
            {/* TODO: change below to loading icon */}
            <svg
              width="26"
              height="29"
              viewBox="0 0 26 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.875 2H6.825C4.1625 2 2 4.175 2 6.825V24.4375C2 26.6875 3.6125 27.6375 5.5875 26.55L11.6875 23.1625C12.3375 22.8 13.3875 22.8 14.025 23.1625L20.125 26.55C22.1 27.65 23.7125 26.7 23.7125 24.4375V6.825C23.7 4.175 21.5375 2 18.875 2Z"
                fill="#1E2F97"
                stroke="#1E2F97"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="font-semibold text-xl">{title}</div>
      <ul className="flex font-medium text-sm">
        <li className="px-[.625rem] py-2 bg-[#D8F9C4] rounded-[30px]">
          {locations.find(({ value }) => value === location).label}
        </li>
      </ul>
    </div>
  );
}

const departments = [
  { value: 'HUMANITIES', label: 'Humanities' },
  { value: 'PHYSICAL_SCIENCES', label: 'Physical Sciences' },
  { value: 'LIFE_SCIENCES', label: 'Life Sciences' },
  { value: 'ENGINEERING', label: 'Engineering' },
  { value: 'SOCIAL_SCIENCES', label: 'Social Sciences' },
];
const locations = [
  { value: 'ON_CAMPUS', label: 'On Campus' },
  { value: 'OFF_CAMPUS', label: 'Off Campus' },
  { value: 'REMOTE', label: 'Remote' },
];
const durations = [
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'SUMMER', label: 'Summer' },
  { value: 'ACADEMIC_YEAR', label: 'Academic Year' },
  { value: 'YEAR_ROUND', label: 'Year Round' },
];
const payRanges = [];

function Home({ jobs: originalJobs }) {
  const { isLoading, isError, data, status } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      return await (await fetch('/api/applications')).json();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const [jobs, setJobs] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedPayRanges, setSelectedPayRanges] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedJobID, setSelectedJobID] = useState(null);

  const [isReversed, setIsReversed] = useState(false);
  useEffect(() => {
    if (status !== 'success') {
      return;
    }
    const markedJobs = data.map(({ job: { id } }) => id);
    const unmarkedJobs = originalJobs
      .filter(({ id }) => !markedJobs.includes(id))
      .map((j) => ({ ...j, saved: false }));
    setJobs(unmarkedJobs);
    setSelectedJobID(unmarkedJobs[0]?.id);
  }, [data, status, originalJobs]);

  let filteredJobs = [...jobs];
  if (selectedLocations.length !== 0 && selectedLocations.length !== locations.length) {
    filteredJobs = filteredJobs.filter(({ location }) => selectedLocations.includes(location));
  }
  if (selectedDurations.length !== 0 && selectedDurations.length !== durations.length) {
    filteredJobs = filteredJobs.filter(({ duration }) => selectedDurations.includes(duration));
  }
  if (selectedDepartments.length !== 0 && selectedDepartments.length !== departments.length) {
    filteredJobs = filteredJobs.filter(({ departments }) =>
      departments.some((item) => selectedDepartments.includes(item))
    );
  }
  if (isReversed) {
    filteredJobs.reverse();
  }

  const selectedJob = jobs.find(({ id }) => id === selectedJobID);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      <NavBar />
      <main className="min-h-screen bg-light-gray pt-9 pl-[3.75rem]">
        <div className="flex gap-9 flex-col">
          <div className="flex">
            <div className="flex gap-x-6 flex-wrap gap-y-36">
              <button onClick={() => setIsReversed(!isReversed)}>Sort By</button>
              <div className="flex flex-col relative">
                {/* https://www.w3docs.com/snippets/css/how-to-set-absolute-positioning-relative-to-the-parent-element.html */}
                <Listbox value={selectedDepartments} onChange={setSelectedDepartments} multiple>
                  <Listbox.Button className="h-12 rounded-3xl text-lg px-4 py-3 text-center bg-white">
                    Department
                  </Listbox.Button>
                  <Listbox.Options className="border-2 border-black absolute top-12">
                    {departments.map(({ value, label }) => (
                      <Listbox.Option key={value} value={value} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex min-w-max px-1 ${
                              active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            <CheckIcon className={`h-6 w-6${selected ? '' : ' invisible'}`} />
                            {label}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              <div className="flex flex-col relative">
                <Listbox value={selectedDurations} onChange={setSelectedDurations} multiple>
                  <Listbox.Button className="h-12 rounded-3xl text-lg px-4 py-3 text-center bg-white">
                    Duration
                  </Listbox.Button>
                  <Listbox.Options className="border-2 border-black absolute top-12">
                    {durations.map(({ value, label }) => (
                      <Listbox.Option key={value} value={value} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex min-w-max px-1 ${
                              active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            <CheckIcon className={`h-6 w-6${selected ? '' : ' invisible'}`} />
                            {label}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              <div className="flex flex-col relative">
                <Listbox value={selectedPayRanges} onChange={setSelectedPayRanges} multiple>
                  <Listbox.Button className="h-12 rounded-3xl text-lg px-4 py-3 text-center bg-white">
                    Pay
                  </Listbox.Button>
                  <Listbox.Options className="border-2 border-black absolute top-12">
                    {payRanges.map(({ value, label }) => (
                      <Listbox.Option key={value} value={value} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex min-w-max px-1 ${
                              active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            <CheckIcon className={`h-6 w-6${selected ? '' : ' invisible'}`} />
                            {label}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
              <div className="flex flex-col relative">
                <Listbox value={selectedLocations} onChange={setSelectedLocations} multiple>
                  <Listbox.Button className="h-12 rounded-3xl text-lg px-4 py-3 text-center bg-white">
                    Locations
                  </Listbox.Button>
                  <Listbox.Options className="border-2 border-black absolute top-12">
                    {locations.map(({ value, label }) => (
                      <Listbox.Option key={value} value={value} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex min-w-max px-1 ${
                              active ? 'bg-blue-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            <CheckIcon className={`h-6 w-6${selected ? '' : ' invisible'}`} />
                            {label}
                          </li>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              </div>
            </div>
          </div>
          {!isLoading && !isError && (
            <div className="flex gap-10">
              <div className="flex flex-col gap-6 w-[28.5rem]">
                {/* TODO: maybe add overflow-y-scroll and correct height above */}
                {filteredJobs.map(
                  ({ id, title, departments, duration, location, lab: { name: labName }, saved }) =>
                    saved ? (
                      <SavedJobCard
                        key={id}
                        id={id}
                        updateJob={() =>
                          setJobs(jobs.map((j) => (j.id === id ? { ...j, saved: false } : j)))
                        }
                        labName={labName}
                        title={title}
                        departments={departments}
                        duration={duration}
                        location={location}
                        setSelectedJob={() => setSelectedJobID(id)}
                        isSelectedJob={selectedJobID === id}
                      />
                    ) : (
                      <JobCard
                        key={id}
                        id={id}
                        updateJob={() =>
                          setJobs(jobs.map((j) => (j.id === id ? { ...j, saved: true } : j)))
                        }
                        labName={labName}
                        title={title}
                        departments={departments}
                        duration={duration}
                        location={location}
                        setSelectedJob={() => setSelectedJobID(id)}
                        isSelectedJob={selectedJobID === id}
                      />
                    )
                  // id, updateJob, title, description, duration, toast, departments/>
                )}
              </div>
              <div className="flex flex-col p-12 w-[50rem] rounded-[20px] bg-white h-fit">
                {selectedJob && (
                  <>
                    <div className="font-medium text-base">{selectedJob.lab.name}</div>
                    <div className="font-bold text-2xl mt-4">{selectedJob.title}</div>
                    <div className="flex gap-2 mt-4">
                      <div>Posted on {dateFormatter.format(new Date(selectedJob.created))}</div>
                      <div aria-hidden="true">|</div>
                      <div>{0} Applicants</div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-12 sticky">
                      {[
                        { field: 'Department', value: selectedJob.departments[0] ?? '' },
                        {
                          field: 'Location',
                          value: locations.find(({ value }) => value === selectedJob.location)
                            .label,
                        },
                        { field: 'Position Type', value: '' },
                        { field: 'Desired Start Date', value: '' },
                        { field: 'Research Area', value: '' },
                        {
                          field: 'Duration',
                          value: durations.find(({ value }) => value === selectedJob.duration)
                            .label,
                        },
                        { field: 'Approved for Credit', value: selectedJob.credit ? 'Yes' : 'No' },
                      ].map(({ field, value }) => (
                        <div className="flex flex-col w-[13.75rem] gap-1" key={field}>
                          <div className="text-base font-bold">{field}</div>
                          <div className="text-sm font-normal">{value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col mt-12 text-lg font-normal gap-5">
                      <div>
                        <span className="font-bold">Approximate hours per week:</span>{' '}
                        {selectedJob.weeklyHours}
                      </div>
                      <div>
                        <span className="font-bold">Applications Accepted Until:</span>{' '}
                        {dateFormatter.format(new Date(selectedJob.closingDate))}
                      </div>
                      <div>
                        <div className="font-bold">Job Description:</div>
                        <div dangerouslySetInnerHTML={{ __html: selectedJob.description }}></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      departments: true,
      duration: true,
      location: true,
      lab: { select: { name: true } },
      created: true,
      closingDate: true,
      credit: true,
      weeklyHours: true,
    },
    take: 50,
  });

  return {
    props: {
      jobs: jobs.map((job) => ({
        ...job,
        created: JSON.parse(JSON.stringify(job.created)),
        closingDate: JSON.parse(JSON.stringify(job.closingDate)),
      })),
    },
  };
}

export default Home;
