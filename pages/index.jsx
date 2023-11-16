import prisma from '@lib/prisma';

import { useState, Fragment, useEffect } from 'react';
import { Listbox, Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from '@tanstack/react-query';
import NavBar from '../components/NavBar';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { JobSearchValidator } from '@lib/validators';
import Head from 'next/head';
import { Departments, Majors } from '@lib/globals';

function ResearcherJobCard({
  id,
  title,
  location,
  duration,
  departments,
  labName,
  setSelectedJob,
  isSelectedJob,
}) {
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
        {
          <button className="flex items-center w-6 invisible" aria-hidden>
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
        }
      </div>
      <div className="font-semibold text-xl">{title}</div>
      <ul className="flex font-medium text-sm gap-2">
        <li className="px-[.625rem] py-2 bg-[#A1DDFF] rounded-[30px]">
          {Departments.find(({ value }) => value === departments[0]).label}
        </li>
        <li className="px-[.625rem] py-2 bg-[#D8F9C4] rounded-[30px]">
          {locations.find(({ value }) => value === location).label}
        </li>
      </ul>
    </div>
  );
}

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
      <ul className="flex font-medium text-sm gap-2">
        <li className="px-[.625rem] py-2 bg-[#A1DDFF] rounded-[30px]">
          {Departments.find(({ value }) => value === departments[0]).label}
        </li>
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
      <ul className="flex font-medium text-sm gap-2">
        <li className="px-[.625rem] py-2 bg-[#A1DDFF] rounded-[30px]">
          {Departments.find(({ value }) => value === departments[0]).label}
        </li>
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
const payRanges = [
  { value: true, label: 'Paid' },
  { value: false, label: 'Unpaid' },
];

function toHyphenatedDateString(date) {
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1).toString(10).padStart(2, '0') +
    '-' +
    date.getDate().toString(10).padStart(2, '0')
  );
}

function Home({ jobs: originalJobs }) {
  const { isLoading, isError, data, status } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      return await (await fetch('/api/applications')).json();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    cacheTime: 0, // don't cache. TODO: decide on what to to for researchers: maybe don't fetch at all
  });

  const [jobs, setJobs] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedPayRanges, setSelectedPayRanges] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedJobID, setSelectedJobID] = useState(null);
  const [copiedExternalLink, setCopiedExternalLink] = useState(false);

  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    const storedAccountType = localStorage.getItem('accountType');
    if (storedAccountType === 'researcher' || storedAccountType === 'student') {
      setAccountType(storedAccountType);
    } else {
      async function getAccountType() {
        try {
          const accType = (await (await fetch('/api/account-type')).json()).accountType;
          // localStorage.setItem('accountType', accType); // let NavBar set accountType in localStorage
          setAccountType(accType);
        } catch (err) {
          setAccountType('student'); // default to student // TODO: improve this when fetch fails
        }
      }
      getAccountType();
    }
  }, []);

  const [isFiltersDialogOpen, setIsFiltersDialogOpen] = useState(!true);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(JobSearchValidator),
  });

  const appliedMutation = useMutation({
    mutationFn: async () => {
      return await (
        await fetch(`/api/applications/${selectedJobID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'APPLIED',
          }),
        })
      ).json();
    },
    onSettled: (data) => {
      if (data?.lastUpdated) {
        setCopiedExternalLink(false);
      }
    },
  });
  // useEffect(() => setCopiedExternalLink(false), [selectedJobID]);

  useEffect(() => {
    if (errors?.jobSearchQuery?.type === 'string.empty') {
      setJobs(originalJobs);
    }
  }, [errors]);

  let filteredJobs = [...jobs];
  if (selectedPayRanges.length !== 0 && selectedPayRanges.length !== departments.length) {
    filteredJobs = filteredJobs.filter(({ paid }) => selectedPayRanges.includes(paid));
  }
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
      <Head>
        <title>bResearch</title>
      </Head>
      <NavBar pathname="/" />
      <main className="min-h-screen bg-light-gray pt-9 pl-[3.75rem]">
        <div className="flex gap-9 flex-col">
          <div className="flex">
            <div className="flex gap-x-6 flex-wrap gap-y-6">
              <form
                className="flex items-center gap-2"
                role="search"
                onSubmit={handleSubmit(async (d) => {
                  try {
                    const response = await fetch(
                      `/api/jobs/search?jobSearchQuery=${d.jobSearchQuery}`
                    );
                    if (response.ok) {
                      const jobs = await response.json();
                      setJobs(jobs);
                    }
                  } catch (e) {}
                })}
              >
                <input
                  placeholder="Search"
                  className="rounded-3xl pl-3 pr-11 h-[3.25rem]"
                  {...register('jobSearchQuery')}
                />
                {/* TODO: put svg in button and make it submit form */}
                <svg
                  width="20"
                  height="26"
                  viewBox="0 0 20 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative right-11"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.1029 5.7118C9.88777 4.45771 6.64861 4.92822 4.70834 7.22395C3.79332 8.3066 2.12809 8.47928 0.988936 7.60965C-0.150218 6.74003 -0.331917 5.15739 0.583099 4.07474C4.07376 -0.055407 10.1921 -1.22293 14.8102 1.39108C18.6866 3.58463 20.7335 8.04179 19.7589 12.2912C19.1292 15.0363 17.4498 16.8817 15.9423 18.0365C15.9723 18.0774 16.0023 18.1184 16.0323 18.1593C16.9825 19.4558 17.932 20.7513 18.8828 22.047C19.7187 23.186 19.4248 24.7533 18.2264 25.5477C17.0279 26.3421 15.3788 26.0628 14.5429 24.9238C13.5912 23.6269 12.6396 22.3286 11.6884 21.0307C11.1284 20.2666 10.5685 19.5027 10.0088 18.7393C9.55022 18.1139 9.41496 17.3244 9.6411 16.5929C9.86724 15.8615 10.4304 15.267 11.1721 14.9768C11.4339 14.8743 14.0064 13.7596 14.5891 11.2202M12.1029 5.7118C14.0162 6.79425 15.0807 9.07621 14.5891 11.2202L12.1029 5.7118Z"
                    fill="#8B8B8B"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.15315 9.68257C7.88077 9.90492 7.72363 10.139 7.71868 10.1464C7.33302 10.7383 6.52261 10.9169 5.90871 10.545C5.2948 10.1731 5.10977 9.39179 5.49543 8.79983C5.56919 8.68661 5.89392 8.20989 6.45672 7.75044C7.02053 7.29017 7.91403 6.7761 9.08691 6.78267L9.08849 6.78268C10.0438 6.78914 10.765 7.14044 11.1398 7.36282C11.7572 7.7292 11.9498 8.50886 11.5698 9.10424C11.1898 9.69962 10.3813 9.88525 9.76381 9.51887C9.60778 9.42628 9.36376 9.31638 9.07085 9.31421C8.73734 9.31258 8.43071 9.45598 8.15315 9.68257Z"
                    fill="#8B8B8B"
                  />
                </svg>
              </form>
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
              <button
                onClick={() => setIsFiltersDialogOpen(true)}
                className="h-12 rounded-3xl text-lg px-4 py-3 text-center text-white bg-dark-blue"
              >
                All Filters
              </button>
            </div>
          </div>
          {!isLoading && !isError && (
            <div className="flex gap-10">
              <div className="flex flex-col gap-6 w-[28.5rem]">
                {/* TODO: maybe add overflow-y-scroll and correct height above */}
                {filteredJobs.length ? (
                  filteredJobs.map(
                    ({
                      id,
                      title,
                      departments,
                      duration,
                      location,
                      lab: { name: labName },
                      saved,
                    }) => {
                      if (accountType === 'researcher') {
                        return (
                          <ResearcherJobCard
                            key={id}
                            id={id}
                            labName={labName}
                            title={title}
                            departments={departments}
                            duration={duration}
                            location={location}
                            setSelectedJob={() => {
                              setSelectedJobID(id);
                              setCopiedExternalLink(false);
                            }}
                            isSelectedJob={selectedJobID === id}
                          />
                        );
                      }
                      return saved ? (
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
                          setSelectedJob={() => {
                            setSelectedJobID(id);
                            setCopiedExternalLink(false);
                          }}
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
                          setSelectedJob={() => {
                            setSelectedJobID(id);
                            setCopiedExternalLink(false);
                          }}
                          isSelectedJob={selectedJobID === id}
                        />
                      );
                    }
                    // id, updateJob, title, description, duration, toast, departments/>
                  )
                ) : (
                  <div>There are zero unsaved jobs that match these filters</div>
                )}
              </div>
              {selectedJob && (
                <div className="flex flex-col p-12 w-[50rem] rounded-[20px] bg-white h-fit">
                  <>
                    <div className="font-medium text-base">{selectedJob.lab.name}</div>
                    <div className="font-bold text-2xl mt-4">{selectedJob.title}</div>
                    <div className="flex gap-2 mt-4">
                      <div>Posted on {dateFormatter.format(new Date(selectedJob.created))}</div>
                      <div aria-hidden="true">|</div>
                      <div>
                        {selectedJob._count.applicants} Applicant
                        {selectedJob._count.applicants !== 1 && 's'}
                      </div>
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
                        {
                          field: 'Desired Start Date',
                          value: toHyphenatedDateString(new Date(selectedJob.startDate)),
                        },
                        { field: 'Research Area', value: '' },
                        {
                          field: 'Duration',
                          value: durations.find(({ value }) => value === selectedJob.duration)
                            .label,
                        },
                        {
                          field: 'Approved for Credit',
                          value: selectedJob.credit === null ? 'No' : selectedJob.credit || 'Yes',
                        },
                      ].map(({ field, value }) => (
                        <div className="flex flex-col w-[13.75rem] gap-1" key={field}>
                          <div className="text-base font-bold">{field}</div>
                          <div className="text-sm font-normal">{value}</div>
                        </div>
                      ))}
                    </div>
                    {accountType === 'student' && (
                      <div className="flex items-center gap-4 mt-12">
                        <button className="rounded-[50%] bg-[#F3F3F3] w-14 h-14 flex items-center justify-center">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_2065_43)">
                              <path
                                d="M15.2427 2.01038H6.75747C4.88262 2.01038 3.35986 3.54194 3.35986 5.40798V17.8101C3.35986 19.3945 4.49533 20.0634 5.88606 19.2977L10.1815 16.9123C10.6392 16.657 11.3786 16.657 11.8275 16.9123L16.1229 19.2977C17.5136 20.0723 18.6491 19.4033 18.6491 17.8101V5.40798C18.6403 3.54194 17.1175 2.01038 15.2427 2.01038Z"
                                stroke="#1E2F97"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_2065_43">
                                <rect
                                  width="21.125"
                                  height="21.125"
                                  fill="white"
                                  transform="translate(0.4375 0.25)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </button>
                        {selectedJob.externalLink && (
                          <>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(selectedJob.externalLink);
                                setCopiedExternalLink(true);
                              }}
                              className="bg-dark-blue text-white font-extrabold text-base flex gap-3 items-center px-6 py-4 rounded-[32px]"
                            >
                              Apply Externally
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.1667 9.16663L18 2.33329M18.6667 5.66663V1.66663H14.6667M9.5 1.66663H7.83333C3.66667 1.66663 2 3.33329 2 7.49996V12.5C2 16.6666 3.66667 18.3333 7.83333 18.3333H12.8333C17 18.3333 18.6667 16.6666 18.6667 12.5V10.8333"
                                  stroke="white"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                            {copiedExternalLink && (
                              <div className="flex gap-2 h-14 items-center">
                                <div>Copied Application Link. Did you apply?</div>
                                <button
                                  onClick={() => {
                                    appliedMutation.mutate();
                                  }}
                                  className="bg-dark-blue text-white text-base items-center px-2 py-1 rounded-md"
                                >
                                  Yes
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
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
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Transition appear show={isFiltersDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsFiltersDialogOpen(false)}>
          {/* TODO: Add font https://stackoverflow.com/questions/75422265/next-font-works-everywhere-except-one-specific-component */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="div" className="text-lg font-medium leading-6 text-gray-900">
                    All Filters
                  </Dialog.Title>
                  <div className="flex">
                    <div className="flex-col">
                      <div>Departments</div>
                      {departments.map(({ value, label }) => {
                        const updateFilter = () =>
                          setSelectedDepartments(
                            selectedDepartments.includes(value)
                              ? selectedDepartments.filter((d) => d !== value)
                              : [...selectedDepartments, value]
                          );
                        return (
                          <Fragment key={value}>
                            <input
                              type="checkbox"
                              id={label}
                              name={label}
                              checked={selectedDepartments.includes(value)}
                              onChange={updateFilter}
                            />
                            <label htmlFor={label}>{label}</label>
                            <br />
                          </Fragment>
                        );
                      })}
                    </div>
                    <div className="flex-col">
                      <div>Paid</div>
                      {payRanges.map(({ value, label }) => {
                        const updateFilter = () =>
                          setSelectedPayRanges(
                            selectedPayRanges.includes(value)
                              ? selectedPayRanges.filter((p) => p !== value)
                              : [...selectedPayRanges, value]
                          );
                        return (
                          <Fragment key={value}>
                            <input
                              type="checkbox"
                              id={label}
                              name={label}
                              checked={selectedPayRanges.includes(value)}
                              onChange={updateFilter}
                            />
                            <label htmlFor={label}>{label}</label>
                            <br />
                          </Fragment>
                        );
                      })}
                    </div>
                    <div className="flex-col">
                      <div>Duration</div>
                      {durations.map(({ value, label }) => {
                        const updateFilter = () =>
                          setSelectedDurations(
                            selectedDurations.includes(value)
                              ? selectedDurations.filter((duration) => duration !== value)
                              : [...selectedDurations, value]
                          );
                        return (
                          <Fragment key={value}>
                            <input
                              type="checkbox"
                              id={label}
                              name={label}
                              checked={selectedDurations.includes(value)}
                              onChange={updateFilter}
                            />
                            <label htmlFor={label}>{label}</label>
                            <br />
                          </Fragment>
                        );
                      })}
                    </div>
                    <div className="flex-col">
                      <div>Locations</div>
                      {locations.map(({ value, label }) => {
                        const updateFilter = () =>
                          setSelectedLocations(
                            selectedLocations.includes(value)
                              ? selectedLocations.filter((location) => location !== value)
                              : [...selectedLocations, value]
                          );
                        return (
                          <Fragment key={value}>
                            <input
                              type="checkbox"
                              id={label}
                              name={label}
                              checked={selectedLocations.includes(value)}
                              onChange={updateFilter}
                            />
                            <label htmlFor={label}>{label}</label>
                            <br />
                          </Fragment>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsFiltersDialogOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
      paid: true,
      externalLink: true,
      startDate: true,
      _count: {
        select: {
          applicants: { where: { status: 'APPLIED' } },
        },
      },
    },
    where: { closed: false, closingDate: { gt: new Date() } },
    take: 50,
  });

  return {
    props: {
      jobs: jobs.map((job) => ({
        ...job,
        created: JSON.parse(JSON.stringify(job.created)),
        closingDate: JSON.parse(JSON.stringify(job.closingDate)),
        startDate: JSON.parse(JSON.stringify(job.startDate)),
      })),
    },
  };
}

export default Home;
