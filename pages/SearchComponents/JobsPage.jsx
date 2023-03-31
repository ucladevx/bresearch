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
  const Duration = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];

  const [allCheckedBoxes, setallCheckedBoxes] = useState(new Set());

  return (
    <div class="bg-teal-100 p-10">
      <div class="bg-teal-300 p-4">
        <CheckBox
          allCheckedBoxes={allCheckedBoxes}
          setallCheckedBoxes={setallCheckedBoxes}
          Department={Department}
          Duration={Duration}
        />
      </div>
      <JobsList jobs={jobs} allCheckedBoxes={allCheckedBoxes} />
    </div>
  );
};

export default JobsPage;
