import React from 'react';

const JobsList = ({ jobs, checkedDepartments }) => {
  console.log('checkeddepartments', checkedDepartments);
  let filteredJobs = jobs.filter((job) =>
    job.departments.some((department) => checkedDepartments.has(department))
  );
  console.log(filteredJobs);
  if (filteredJobs.length === 0) filteredJobs = jobs;

  return (
    <div>
      <div class="text-black underline bold bg-green-600 p-4 m-4">Jobs Available:</div>
      {filteredJobs.map((job, index) => {
        return (
          <div class="hover:bg-green-300 rounded p-4 m-4 text-black" key={index}>
            <ul key={job.id}>
              <li>{job.title}</li>
              <li>Job Description: {job.description}</li>
              <li>Lab Name: {job.lab.name}</li>
              <li>Job Department: {job.departments}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default JobsList;
