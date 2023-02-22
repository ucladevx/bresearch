import { useState } from 'react';

const SearchJobForm = ({ searchForm }, { setsearchForm }, { setdisplayedJobs }) => {
  const handleSubmit = (e) => {
    e.prevent.Default();
    if (searchForm) {
      //TODO:
    }
  };
  return <div>Jobs</div>;
};

export default SearchJobForm;
