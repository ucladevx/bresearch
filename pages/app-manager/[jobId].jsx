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
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

import {
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
      <div className="mb-10">
        <ApplicantTable data={applicants} />
      </div>
    </div>
  );
}

const ApplicantTable = (props) => {
  const [sorting, setSorting] = useState([]);
  const { data } = props;

  const columns = [
    //TODO: Double check what the fullName col filters by, should just treat as string
    {
      header: 'Applicant',
      id: 'fullName',
      accessorFn: (row) =>
        `${row.applicant.studentProfile.firstName} ${row.applicant.studentProfile.lastName}`,
    },
    //TODO: Check how class should be sorted, since it will sort it as a string - ex. Spring 2023 will come before Winter 2023, might need to add a custom sort or do some conversion first
    {
      header: 'Class',
      id: 'class',

      accessorKey: 'applicant.studentProfile.graduationDate',
    },

    {
      header: 'Tags',
      //accessorFn: (row) => `${row.piStatus} ${row.applicant.email}`,

      accessorKey: 'piStatus',
      cell: ({ row, getValue }) => (
        <div className=" py-2.5">
          <TagDropdown
            applicantEmail={row.original.applicant.email}
            piStatus={getValue().toString()}
          />
        </div>
      ),
    },
    {
      //TODO: Set up resume link
      header: 'Resume',
      accessorKey: 'applicant.studentProfile.id',
      id: 'resume',
      enableSorting: false,
      cell: ({ getValue }) => <div>name_resume.pdf</div>,
    },
    {
      header: 'Profile',
      accessorKey: 'applicant.studentProfile.id',
      id: 'profile',
      enableSorting: false,
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
      //TODO: Format date correctly, not sure if it understands the Date object
      header: 'Date Applied',
      accessorKey: 'lastUpdated',
      sortingFn: 'datetime',
    },
  ];
  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  //TODO: Add Search Bar + Style
  //TODO: Do we want any onHover behavior for pagination or sort buttons, maybe make the sorting more clear
  return (
    <div className="bg-white mt-4 w-11/12 h-5/6 mx-auto p-12 rounded-2xl shadow-md ">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
          <thead className="text-base font-medium text-gray-700 border-b bg-white dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th className="px-6 py-2.5" key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: ` flex items-baseline justify-start ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`,
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpIcon className="w-auto pl-1 h-3.5" />,
                          desc: <ArrowDownIcon className="w-auto pl-1 h-3.5" />,
                        }[header.column.getIsSorted().toString()] ?? null}
                      </div>
                    )}
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
        <div className="h-2" />
        <div className="flex gap-5 pt-3 text-sm items-center justify-end">
          <span className="-mr-3">Rows Per Page: </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="flex items-center gap-1">
            {1 + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}-
            {table.getCanNextPage()
              ? (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize
              : table.getFilteredRowModel().rows.length}{' '}
            of {table.getFilteredRowModel().rows.length}
          </span>

          <button
            className="rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-6 w-6 black opacity-50" />
          </button>
          <button
            className="rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-6 w-6 black opacity-50" />
          </button>
        </div>
      </div>
    </div>
  );
};
