//TODO: Checkboxes
//TODO: Update pagination to cursor-based, add prefetch of next page
//Note: This page is dynamic under a [jobId] because each job will have its own applicant view for a PI
import TagDropdown from '../../components/TagDropdown';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
//Need to fix SVGs to just use icons instead
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/20/solid';
import { ArrowDownIcon, ArrowUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

import {
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import { options } from 'joi';
import { data } from 'autoprefixer';

async function fetchApplicants(router, pageIndex, pageSize) {
  if (!router.isReady) {
    return;
  }
  const { jobId } = router.query;
  try {
    const res = await fetch(
      `/api/applications/${jobId}/applicants?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.status === 200) {
    }
    const data = await res.json();

    return data;
  } catch (e) {
    throw e;
  }
}

async function fetchApplicantCount(router) {
  if (!router.isReady) {
    return;
  }
  const { jobId } = router.query;
  try {
    const res = await fetch(`/api/applications/${jobId}/applicants-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
    }
    const data = await res.json();
    console.log({ data });
    return data;
  } catch (e) {
    throw e;
  }
}

//Applicant Manager page
export default function ApplicantManager() {
  //Main page display
  //ml-28 mt-8 mb-8
  return (
    <div className="z-1 w-full h-full absolute bg-neutral-100 overflow-y-auto">
      <h1 className="text-2xl font-bold justify-self-left ml-28 mt-8 mb-8">Manage Applicants</h1>
      <div className="mb-10">
        <ApplicantTable />
      </div>
    </div>
  );
}

const ApplicantTable = (props) => {
  //const { applicantCount } = props;
  const [sorting, setSorting] = useState([]);
  const queryClient = useQueryClient();
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
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
        header: 'Tags',
        accessorKey: 'piStatus',
        cell: ({ row, getValue }) => (
          <div className="py-2.5 -mr-4">
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
    ],
    []
  );
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

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  //TODO: Update all page sections to use cursor instead, also set pageSize to negative when requesting previous page and abs when setting next page
  //TODO: Add prefetching next page, probably with prefetchQuery or fetchQuery

  const router = useRouter();
  const fetchDataOptions = {
    router,
    pageIndex,
    pageSize,
  };
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const applicantQuery = useQuery({
    queryKey: ['applicants-count', router],
    queryFn: () => fetchApplicantCount(router),
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const [applicantCount, setApplicantCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const { status, data, error, isFetching, isPlaceholderData, isPreviousData } = useQuery({
    queryKey: ['applicants', fetchDataOptions],
    queryFn: () => fetchApplicants(router, pageIndex, pageSize),
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!applicantCount,
  });

  useEffect(() => {
    if (!applicantCount && !pageCount) {
      setApplicantCount(applicantQuery?.data);
      setPageCount(Math.ceil(applicantQuery?.data / pageSize));
    }
    if (applicantCount && pageCount) setPageCount(Math.ceil(applicantCount / pageSize));
  }, [applicantQuery, pageSize]);

  const defaultData = useMemo(() => [], []);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    pageCount: pageCount ?? 0,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      pagination,
      sorting,
      globalFilter,
      applicantCount,
      pageCount,
    },
    autoResetPage: false,
    sortingFns: {
      myCustomSorting: quarter_sort,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    //getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  //TODO: Do we want any onHover behavior for pagination or sort buttons, maybe make the sorting more clear
  //TODO: Do we want any hover behavior for search bar?
  //TODO: what do we want to show for loading/error behavior? (where should message show, styling)
  return (
    <div className="overflow-visible bg-white mt-4 w-11/12 h-5/6 mx-auto p-14 rounded-2xl shadow-md space-y-6">
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
      <div className="relative overflow-x-auto ">
        <table className="table-fixed min-w-[950px] w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
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
            {status === 'pending' ? (
              <div>Loading...</div>
            ) : status === 'error' ? (
              <div>Error: {error.message}</div>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  className=" h-20 bg-white border-b dark:border-gray-700  text-gray-700"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td className="h-20 px-6 py-2.5" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="flex gap-6 pt-3 text-sm  items-center justify-end">
          <span className="-mr-3 text-[#707070]">Rows Per Page: </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
              setPageCount(Math.ceil(applicantCount / pageSize));
            }}
          >
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span className="flex items-center gap-1">
            {1 + table.getState().pagination.pageIndex * table.getState().pagination.pageSize}-
            {table.getCanNextPage() ? (
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize
            ) : applicantQuery?.isLoading ? (
              <div>Loading...</div>
            ) : (
              applicantCount
            )}{' '}
            of {applicantQuery?.isLoading ? <div>Loading...</div> : applicantCount}
          </span>

          <button
            className="rounded"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-6 w-6 black opacity-50" />
          </button>
          {/* < */}

          <button
            className="rounded"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-6 w-6 black opacity-50" />
          </button>
          {/* > */}
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
