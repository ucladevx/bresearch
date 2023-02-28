import React from 'react';
import JobsList from './JobsList';
import { useState } from 'react';
import CheckBox from './CheckBox';

const JobsPage = ({ jobs }) => {
  const Department = [
    'ENGINEERING',
    'HUMANITIES',
    'LIFE_SCIENCES',
    'PHYSICAL_SCIENCES',
    'SOCIAL_SCIENCES',
  ];

  const [checkedDepartments, setcheckedDepartments] = useState(new Set());
  // const [displayedJobs, setdisplayedJobs] = useState(jobs);

  return (
    <div class="bg-white">
      <CheckBox
        checkedDepartments={checkedDepartments}
        setcheckedDepartments={setcheckedDepartments}
        Department={Department}
      />

      <JobsList jobs={jobs} checkedDepartments={checkedDepartments} />
    </div>
  );
};

export default JobsPage;
