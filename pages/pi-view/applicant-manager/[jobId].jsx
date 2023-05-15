//TODO LATER: API call to get all applicants associated with a job
//TODO: Sidebar, will be used on many pages
//TODO: Checkboxes, sorting, search, pagination
//Note: This page is dynamic under a [jobId] because each job will have its own applicant view for a PI
//Might need to be reorganized to ensure its connecting to the right PI, auth when fetching probably solves that
import TagDropdown from './components/TagDropdown';
import { useState } from 'react';

const ApplicantsCard = (props) => {
  const { applicants } = props;
  //Displays the table of applicants
  return (
    <div className="bg-white w-11/12 h-1/3 mx-auto min-h-max p-6 rounded-lg shadow-sm my-4">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-base font-medium text-gray-700 border-b bg-white dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Applicant
              </th>
              <th scope="col" className="px-6 py-3">
                Graduating
              </th>
              <th scope="col" className="px-6 py-3">
                Tags
              </th>
              <th scope="col" className="px-6 py-3">
                Resume
              </th>
              <th scope="col" className="px-6 py-3">
                Profile
              </th>
              <th scope="col" className="px-6 py-3">
                Date Applied
              </th>
            </tr>
          </thead>
          {/*Maps applicants to table rows, some values hard-coded for now */}
          <tbody>
            {applicants.map((applicants) => (
              <tr
                key={applicants.id}
                className="bg-white border-b dark:border-gray-700  text-gray-700"
              >
                <td className="px-6 py-4">
                  {applicants.firstName} {applicants.lastName}
                </td>
                <td className="px-6 py-4">2025</td>
                <td className="px-6 py-4">
                  <TagDropdown />
                </td>
                <td className="px-6 py-4">file</td>
                <td className="px-6 py-4">view</td>
                <td className="px-6 py-4">01/01/2023</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
//Hard-coding some applicants for testing until API set up
export default function ApplicantManager() {
  const applicants = [
    {
      id: 1,
      firstName: 'Joe',
      lastName: 'Bruin',
    },
    {
      id: 2,
      firstName: 'Brenna',
      lastName: 'K',
    },
    {
      id: 3,
      firstName: 'Josie',
      lastName: 'B',
    },
    {
      id: 4,
      firstName: 'Junie B',
      lastName: 'Jones',
    },
    {
      id: 5,
      firstName: 'John',
      lastName: 'Doe',
    },
  ];
  //Main page display
  return (
    <div className="z-1 w-full h-full absolute bg-neutral-100">
      <h1 className="ml-16 mt-3 text-2xl font-bold">Manage Applicants</h1>
      <div>
        <ApplicantsCard applicants={applicants} />
      </div>
    </div>
  );
}
