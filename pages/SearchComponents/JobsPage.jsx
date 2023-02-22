import React from 'react';
import JobsList from './JobsList';
import { useState } from 'react';
import SearchJobForm from './SearchJobForm';

const JobsPage = ({ jobs }) => {
  //  creating states https://www.youtube.com/watch?app=desktop&v=EMVtmld5fVk min 15
  const [sideBarFormState, setsideBarFormState] = useState({
    jobDept: [],
  });
  const [searchForm, setsearchForm] = useState('');
  const [displayedJobs, setdisplayedJobs] = useState(jobs);

  return (
    <>
      <SearchJobForm
        searchForm={searchForm}
        setsearchForm={setsearchForm}
        setdisplayedJobs={setdisplayedJobs}
      />
      <JobsList jobs={displayedJobs} />
    </>
  );
};

export default JobsPage;
