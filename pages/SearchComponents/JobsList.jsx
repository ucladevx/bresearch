import React from 'react';

const JobsList = ({ jobs, allCheckedBoxes }) => {
  console.log('checkedfilters', allCheckedBoxes);

  // let filteredJobs = jobs.filter((job) =>
  //   job.departments.some((department) => allCheckedBoxes.has(department))
  // );

  let filteredJobs = jobs.filter((job) => {
    return (
      job.departments.some((item) => allCheckedBoxes.has(item)) || allCheckedBoxes.has(job.duration)
    );
  });
  console.log(filteredJobs);

  if (filteredJobs.length === 0) filteredJobs = jobs;

  return (
    <div class="bg-teal-500">
      <div class="text-black underline bold bg-teal-600 p-4">Jobs Available:</div>
      {filteredJobs.map((job, index) => {
        return (
          <div class="hover:bg-teal-600 rounded m-4 p-4 text-black" key={index}>
            <ul key={job.id}>
              <li>{job.title}</li>
              <li>Job Description: {job.description}</li>
              <li>Lab Name: {job.lab.name}</li>
              <li>Job Department: {job.departments}</li>
              <li>Job Duration: {job.duration}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default JobsList;
