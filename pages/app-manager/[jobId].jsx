//TODO: Checkboxes, rework pagination to be controlled with Tanstack Query, might require a rework for search filtering as well
//TODO: fix resizing of cols - should only resize for names
//TODO: Make custom sort function for class/graduation
//Note: This page is dynamic under a [jobId] because each job will have its own applicant view for a PI
import TagDropdown from '../../components/TagDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
//Need to fix SVGs to just use icons instead
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
  const [globalFilter, setGlobalFilter] = useState('');
  //TODO: Do we want to add an email column? or just expect PIs to go to their student profile?
  const columns = [
    //Full name column just sorts by full name as a string, is that okay? Do we want separate first and last name columns?
    {
      header: 'Applicant',
      id: 'fullName',
      accessorFn: (row) =>
        `${row.applicant.studentProfile.firstName} ${row.applicant.studentProfile.lastName}`,
    },
    {
      header: 'Class',
      id: 'class',
      accessorKey: 'applicant.studentProfile.graduationDate',
      sortingFn: 'myCustomSorting',
    },

    {
      //TODO: Double-check how we want this sorted, rn just string sort so alphanumerical
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
      cell: (props) => <div className="underline">name_resume.pdf</div>, //this will eventually actually fetch and show the name of their pdf
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
      //TODO: Might need to add a . after the month abbreviation
      header: 'Date Applied',
      id: 'lastUpdated',
      accessorFn: (row) =>
        new Intl.DateTimeFormat('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).format(new Date(row.lastUpdated)), //Change to abbrev month spelled out, then day, and then year
      sortingFn: 'datetime',
    },
  ];
  const quarter_sort = (rowA, rowB, columnId) => {
    const rowA_split = rowA.original.applicant.studentProfile.graduationDate.split(' ');
    const rowB_split = rowB.original.applicant.studentProfile.graduationDate.split(' ');

    const year_sort = rowA_split[1] < rowB_split[1] ? -1 : rowA_split[1] == rowB_split[1] ? 0 : 1;
    //If the years are different, sort by year
    if (year_sort != 0) return year_sort;
    //If the years are the same, sort by quarter
    const quarter_priority = (A) => {
      A = A.toLowerCase();
      if (A == 'spring') return 0;
      if (A == 'summer') return 1;
      if (A == 'fall') return 2;
      if (A == 'winter') return 3;
    };
    const rowA_quarter = quarter_priority(rowA_split[0]);

    const rowB_quarter = quarter_priority(rowB_split[0]);
    return rowA_quarter < rowB_quarter ? -1 : rowA_quarter == rowB_quarter ? 0 : 1;
  };

  const table = useReactTable({
    data,
    columns,

    state: {
      sorting,
      globalFilter,
    },
    sortingFns: {
      myCustomSorting: quarter_sort,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  //TODO: Do we want any onHover behavior for pagination or sort buttons, maybe make the sorting more clear
  //TODO: Do we want any hover behavior for search bar?
  return (
    <div className="bg-white mt-4 w-11/12 h-5/6 mx-auto p-12 rounded-2xl shadow-md space-y-6">
      <div className="flex items-center justify-end">
        <div className="flex items-center border-b-2 border-[#949494]">
          <MagnifyingGlassIcon className="stroke-2 h-5 w-5 text-[#707070]" />
          <DebouncedInput
            initialValue={globalFilter ?? ''}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 text-base text-[#8b8b8b] outline-none"
            placeholder="Search..."
          />
        </div>
      </div>
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
        <div className="flex gap-6 pt-3 text-sm  items-center justify-end">
          <span className="-mr-3 text-[#707070]">Rows Per Page: </span>
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

//Need to debounce the search input so that it filters correctly
function DebouncedInput(props) {
  const { initialValue, onChange } = props;
  const debounce = 300;

  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange]);

  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
}
