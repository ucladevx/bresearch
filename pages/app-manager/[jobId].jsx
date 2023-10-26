//TODO: API call to get all applicants associated with a job
//TODO: Sidebar, will be used on many pages
//TODO: Checkboxes, sorting, search
//Note: This page is dynamic under a [jobId] because each job will have its own applicant view for a PI
//Might need to be reorganized to ensure its connecting to the right PI, auth when fetching probably solves that
import TagDropdown from '../../components/TagDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
//Need to fix SVGs to just use icons instead
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import {
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import { options } from 'joi';

//Pagination - will be replaced but keeping now for styling
const Paginator = (props) => {
  //TODO: replace with Tanstack Table version of styling
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
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="relative inline-flex pl-2 text-gray-400 hover:text-gray-500 focus:z-20 focus:outline-offset-0"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
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

//Applicant Manager page
export default function ApplicantManager() {
  const [applicants, setApplicants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    //Router isn't initially hydrated with query params, so wait until ready
    if (!router.isReady) {
      return;
    }
    const { jobId } = router.query;
    fetch(`/api/applications/${jobId}/applicants`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setApplicants(data.applicants);
        console.log(data.applicants);
      })
      .catch((error) => {
        console.log(error);
      });
    //Reloading apps so that if user changes status it updates
  }, [router]);

  //Main page display
  //ml-28 mt-8 mb-8
  return (
    <div className="z-1 w-full h-full absolute bg-neutral-100 overflow-y-auto">
      <h1 className="text-2xl font-bold justify-self-left ml-28 mt-8 mb-8">Manage Applicants</h1>
      <div className="">
        {/*<ApplicantsCard applicants={applicants} />*/}
        <ReactTableComponent data={applicants} />
      </div>
    </div>
  );
}

//React Table Pagination/Filtering with TanStack Version
//This would get called where Applicants Card gets called
const ReactTableComponent = (props) => {
  const { data } = props;
  const columns = [
    {
      header: 'First Name',
      accessorKey: 'applicant.studentProfile.firstName', //might not work because we literally need the values
    },
    {
      header: 'Last Name',
      accessorKey: 'applicant.studentProfile.lastName',
    },
    {
      header: 'Graduating',
      accessorKey: 'applicant.studentProfile.graduationDate',
    },
    {
      header: 'Tags',
      id: 'tags',
      cell: (props) => (
        <div className=" py-2.5">
          <TagDropdown />
        </div>
      ),
    },
    {
      //TODO: Set up resume link
      header: 'Resume',
      accessorKey: 'applicant.studentProfile.id',
      cell: ({ getValue }) => <div>name_resume.pdf</div>,
    },
    {
      header: 'Profile',
      accessorKey: 'applicant.studentProfile.id',
      cell: ({ getValue }) => (
        <div>
          <Link
            className="underline"
            href={`/student/profile/${getValue().toString().replaceAll('-', '')}`}
          >
            view
          </Link>
        </div>
      ),
    },
    {
      //TODO: Add actual value, is it just dateUpdated?
      header: 'Date Applied',
      id: 'Date Applied',
      cell: (props) => <div>dateApplied</div>,
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white mt-4 w-11/12 h-5/6 mx-auto p-12 rounded-lg shadow-sm ">
      <div className="relative overflow-x-auto flex flex-col ">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-base font-medium text-gray-700 border-b bg-white dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="px-6 py-2.5" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr className="bg-white border-b dark:border-gray-700  text-gray-700" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className="px-6 py-2.5" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/*
//Footer HTML, just under tbody
<tfoot>
            <tr>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4"></td>
              <td className="px-5 py-4"></td>
              <td className="px-6 py-4"></td>
              <td colSpan="2" className="pt-4">
                <Paginator />
              </td>
            </tr>
          </tfoot>
*/
