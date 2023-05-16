//TODO: API call to get all applicants associated with a job
//TODO: Sidebar, will be used on many pages
//TODO: Checkboxes, sorting, search
//Note: This page is dynamic under a [jobId] because each job will have its own applicant view for a PI
//Might need to be reorganized to ensure its connecting to the right PI, auth when fetching probably solves that
import TagDropdown from '../../../components/TagDropdown';
import Link from 'next/link';
//Need to fix SVGs to just use icons instead
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';

//Pagination Component
const Paginator = (props) => {
  //TODO: implement pagination
  //TODO: Styling will be fixed for readability later
  //TODO: Adjust display numbers to be dynamic
  return (
    <div className="flex flex-row justify-end space-x-4 ">
      <div>
        <p className="text-xs text-gray-700">
          <span className="font-medium"> 1</span>-<span className="font-medium">10 </span>
          of
          <span className="font-medium"> 97 </span>
        </p>
      </div>

      <div className="flex bg-white pl-4 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <nav className="space-x-5" aria-label="Pagination">
              <a
                href="#"
                className="relative inline-flex px-2 text-gray-400 hover:text-gray-500 focus:z-20 focus:outline-offset-0"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="relative inline-flex pl-2 text-gray-400 hover:text-gray-500 focus:z-20 focus:outline-offset-0"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

//Displaying table of applicants
const ApplicantsCard = (props) => {
  const { applicants } = props;

  return (
    <div className="bg-white w-11/12 h-1/3 mx-auto min-h-max p-12 rounded-lg shadow-sm my-4">
      <div className="relative overflow-x-auto flex flex-col">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
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
              <th scope="col" className="py-4 pl-6 pr-4">
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
                <td className="px-6 py-4">graduationDate</td>
                <td className="px-6 py-4">
                  <TagDropdown />
                </td>
                <td className="px-6 py-4">resumeFile</td>
                <td className="px-6 py-4">
                  <Link href="/pi-view/applicant-manager/1">view</Link>
                </td>
                <td className="py-4 px-6">dateApplied</td>
              </tr>
            ))}
          </tbody>
          {/*Footer contains pagination */}
          <tfoot>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4"></td>
            <td className="px-6 py-4"></td>
            <td colspan="2" className="pt-3">
              <Paginator />
            </td>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

//Applicant Manager page
export default function ApplicantManager() {
  //Hard-coding some applicants for testing until API set up
  const applicants = [
    {
      id: 1,
      firstName: 'Joe',
      lastName: 'Bruin',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
    },
    {
      id: 3,
      firstName: 'Josie',
      lastName: 'B',
    },
    {
      id: 4,
      firstName: 'UCLA',
      lastName: 'Student',
    },
    {
      id: 5,
      firstName: 'John',
      lastName: 'Doe',
    },
  ];
  //Main page display
  return (
    <div className="z-1 w-full h-full absolute bg-neutral-100 overflow-y-auto">
      <h1 className="ml-16 mt-3 text-2xl font-bold">Manage Applicants</h1>
      <div>
        <ApplicantsCard applicants={applicants} />
      </div>
    </div>
  );
}
