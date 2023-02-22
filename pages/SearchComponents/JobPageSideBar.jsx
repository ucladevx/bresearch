import React from 'react';
// import {Switch} from

function JobsPageSideBar({ sideBarFormState }, { setsideBarFormState }, { setdisplayedJobs }) {
  const Department = [
    { value: ENGINEERING, display: 'Engineering' },
    { value: HUMANITIES, display: 'Humanities' },
    { value: LIFE_SCIENCES, display: 'Life Sciences' },
    { value: PHYSICAL_SCIENCES, display: 'Physical Sciences' },
    { value: SOCIAL_SCIENCES, display: 'Social Sciences' },
  ];
}

const handleDepartmentSelect = (e, option) => {
  console.log(e.target.checked, option);
  if (e.target.checked) {
    setsideBarFormState((prevState) => {
      const jobDept = [...prevState.jobDept];
      jobDept.push(option);
      return { ...prevState, jobDept };
    });
  } else {
    setsideBarFormState((prevState) => {
      return {
        ...prevState,
        jobDept: prevState.jobDept.filter((jobDept) => option != jobDept),
      };
    });
  }
};

export default JobsPageSideBar;
