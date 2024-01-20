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
  useQueries,
  keepPreviousData,
  QueryClient,
  useQueryClient,
  QueryClientProvider,
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
import { SecondUpdateProfileValidator } from '@lib/validators';
import { set } from 'react-hook-form';

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
    // console.log(data);
    return data;
  } catch (e) {
    throw e;
  }
}

async function fetchResume(router, profileId) {
  if (!router.isReady) {
    return;
  }
  try {
    const res = await fetch(`/api/student/profile/resume/${profileId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status === 200) {
    }
    const data = await res.json();
    //console.log(data);
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
    // console.log({ data });
    return data;
  } catch (e) {
    throw e;
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 1000 * 60 * 60, //1 hour -- could make it more or less
    },
  },
});
//Applicant Manager page
export default function ApplicantManager() {
  //Main page display
  //ml-28 mt-8 mb-8
  return (
    <QueryClientProvider client={queryClient}>
      <div className="z-1 w-full h-full m-0 bg-cover bg-neutral-100 overflow-y-auto">
        <h1 className="text-2xl font-bold justify-self-left ml-28 mt-8 mb-8">Manage Applicants</h1>
        <div className="mb-10">
          <ApplicantTable />
        </div>
      </div>
    </QueryClientProvider>
  );
}

const ApplicantTable = (props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [applicantCount, setApplicantCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [profileId, setProfileId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  //TODO: Update all page sections to use cursor instead, set pageSize to negative when requesting previous page and abs when setting next page

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const applicantCountQuery = useQuery({
    queryKey: ['applicants-count', router],
    queryFn: () => fetchApplicantCount(router),
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const applicantQuery = useQuery({
    queryKey: ['applicants', router, pageIndex, pageSize],
    queryFn: () => fetchApplicants(router, pageIndex, pageSize),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    keepPreviousData: true,
    enabled: !!applicantCount,
  });

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
        id: 'tags',
        accessorKey: 'piStatus',
        cell: function EditableCell({ getValue, row, column }) {
          const initialValue = getValue();
          const [value, setValue] = useState(initialValue);

          const onChangeValue = () => {
            table.options.meta.refetchData();
          };

          useEffect(() => {
            setValue(initialValue);
          }, [initialValue]);

          return (
            <div className="py-2.5 -mr-4">
              <TagDropdown
                applicantEmail={row.original.applicant.email}
                piStatus={value}
                onChangeValue={onChangeValue}
              />
            </div>
          );
        },
      },
      {
        header: 'Resume',
        id: 'resume',
        accessorKey: 'applicant.studentProfile.resumeURL',
        enableSorting: false,
        cell: function ResumeCell({ row, column }) {
          const [resumeLink, setResumeLink] = useState(null);
          //Will show Load Resume if Resume Link not working, useful for debugging
          useEffect(() => {
            setResumeLink(row.original.applicant.studentProfile.resumeLink);
          }, [row.original.applicant.studentProfile.resumeLink]);
          return (
            <div className="underline">
              {!!resumeLink ? (
                <Link
                  locale={false}
                  href={resumeLink}
                  rel="noreferrer"
                  target="_blank"
                  className="underline"
                >
                  View Resume
                </Link>
              ) : (
                <div>Load Resume</div>
              )}
            </div>
          );
        },
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
          }).format(new Date(row.lastUpdated)),
        sortingFn: 'datetime',
      },
    ],
    []
  );
  //Sort by quarters for grad dates
  const quarter_sort = (rowA, rowB) => {
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

  const profileIds = {}; //object to hold 'profileId': 'resumeLink' pairs
  var resumesRetrieved = 0;
  const fetchResumesFromIDs = async (dataForTable) => {
    const profileIdKeys = Object.keys(profileIds);
    //Going through all profileIds and fetching their resume link from cache or server
    for (const id of profileIdKeys) {
      const resumeData = await queryClient.ensureQueryData({
        queryKey: ['resume', router, id],
        queryFn: () => fetchResume(router, id),
      });
      //Ensure Profile IDs and Resumes are 1:1 matched
      if (profileIds[id] == null) {
        profileIds[id] = resumeData.url;
        resumesRetrieved += 1;
      }
    }
    //Check retrieving resumes finished
    if (resumesRetrieved == pageSize) {
      //Looping back over applicants to add Resume Link
      dataForTable.forEach((applicant) => {
        const applicantID = applicant.applicant.studentProfile.id;
        applicant.applicant.studentProfile.resumeLink = profileIds[applicantID];
      });
      //Only set table data once all resume links retrieved
      setData(dataForTable);
    }
  };

  useEffect(() => {
    if (applicantQuery.data) {
      let dataForTable = applicantQuery.data;
      /*Fetching Resume Links from Profile IDs and add to applicant data for table */
      //Loop to get all profile IDs
      dataForTable.forEach((applicant) => {
        const key = applicant.applicant.studentProfile.id;
        profileIds[key] = null;
      });

      const profileIdKeysArray = Object.keys(profileIds);
      const numProfileIds = profileIdKeysArray.length;
      if (numProfileIds == pageSize) {
        fetchResumesFromIDs(dataForTable);
      }
    }

    /*Setting number of applicants and page count on first table load */
    if (!applicantCount && !pageCount) {
      setApplicantCount(applicantCountQuery?.data);
      setPageCount(Math.ceil(applicantCountQuery?.data / pageSize));
    }
    //Setting page count based on applicants and page size
    if (applicantCount && pageCount) setPageCount(Math.ceil(applicantCount / pageSize));
  }, [applicantCountQuery, pageSize, applicantQuery, profileId]);

  const defaultData = useMemo(() => [], []);
  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    pageCount: pageCount ?? 0,
    onPaginationChange: setPagination,
    manualPagination: true,
    autoResetFilters: false,
    autoResetSortBy: false,
    debugTable: true,
    state: {
      pagination,
      sorting,
      globalFilter,
      applicantCount,
      pageCount,
    },
    meta: {
      refetchData: () => {
        applicantQuery.refetch(); //manually trigger refetch of current page if the data updated
      },

      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
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
    <div className="overflow-hidden bg-white mt-4 w-11/12 h-5/6 mx-auto p-14 rounded-2xl shadow-md space-y-6">
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
            {applicantQuery.status === 'pending' ? (
              <div>Loading...</div>
            ) : applicantQuery.status === 'error' ? (
              <div>Error: {applicantQuery.error.message}</div>
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
            {applicantCount > 0
              ? 1 + table.getState().pagination.pageIndex * table.getState().pagination.pageSize
              : '0'}
            -
            {table.getCanNextPage() ? (
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize
            ) : applicantCountQuery?.isLoading ? (
              <div>Loading...</div>
            ) : (
              applicantCount
            )}{' '}
            of {applicantCountQuery?.isLoading ? <div>Loading...</div> : applicantCount}
          </span>

          <button
            className="rounded"
            onClick={() => {
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-6 w-6 black opacity-50" />
          </button>
          {/* < */}

          <button
            className="rounded"
            onClick={() => {
              table.nextPage();
            }}
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
