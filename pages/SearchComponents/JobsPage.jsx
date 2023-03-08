import React from 'react';
import JobsList from './JobsList';
import { useState } from 'react';
import CheckBox from './CheckBox';
import CheckBoxLists from './CheckBoxLists';

const JobsPage = ({ jobs }) => {
  const Department = [
    'ENGINEERING',
    'HUMANITIES',
    'LIFE_SCIENCES',
    'PHYSICAL_SCIENCES',
    'SOCIAL_SCIENCES',
  ];
  const Duration = ['QUARTERLY', 'SUMMER', 'ACADEMIC_YEAR', 'YEAR_ROUND'];

  const [checkedDepartments, setcheckedDepartments] = useState(new Set());

  return (
    <div class="bg-teal-100 p-10">
      <div class="bg-teal-300 p-4">
        <CheckBox
          checkedDepartments={checkedDepartments}
          setcheckedDepartments={setcheckedDepartments}
          Department={Department}
        />
      </div>
      <JobsList jobs={jobs} checkedDepartments={checkedDepartments} />
    </div>
  );
};

export default JobsPage;
