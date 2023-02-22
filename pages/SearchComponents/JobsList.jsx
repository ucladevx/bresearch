import React from 'react';

const JobsList = ({ jobs }) => {
  return;
  <div>
    {jobs.map((job) => (
      <ul key={job.id}>
        <li>{job.title}</li>
        <li>Job Description: {job.description}</li>
        <li>Lab Name: {job.lab.name}</li>
      </ul>
    ))}
  </div>;
};

export default JobsList;
