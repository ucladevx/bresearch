import Head from 'next/head';
import prisma from '@lib/prisma';
import 'react-quill/dist/quill.snow.css';

import { useState } from 'react';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

function Job(props) {
  console.log(props.job);

  return (
    <div className="max-w-full h-full justify-items-center px-[125px] bg-[#F3F3F3] shadow-md flex flex-col items-center space-x-4 overflow-y-scroll">
      <Head>
        <title>{props.job.title}</title>
      </Head>
      <Navigator />
      <JobWrapper job={props.job} />
    </div>
  );
}

const Navigator = (props) => {
  return (
    <div className="w-3/5 p-5 my-[3.75rem]">
      <button className="font-sans font-bold float-left text-2xl align-middle">Back</button>
      <h1 className="text-center font-bold text-[2rem] text-[#242429] align-middle">Preview</h1>
    </div>
  );
};

const JobWrapper = (props) => {
  const { job } = props;
  const { departments, duration } = job;

  return (
    <div className="w-[1190px] h-[1776px] p-[3rem] bg-white rounded-[20px] drop-shadow-md">
      <JobSummary job={job} />
      {/* <JobTagNav>
        {departments.length > 0 ? (
          departments.map((department) => <JobTagItem key={department}>{department}</JobTagItem>)
        ) : (
          <JobTagNav>No departments found</JobTagNav>
        )}
        {<JobTagItem>{duration}</JobTagItem>}
      </JobTagNav> */}

      <JobHero job={job} />
    </div>
  );
};

const JobSummary = (props) => {
  return (
    <>
      <JobHeader job={props.job} />
      <JobDetails job={props.job} />
      <JobActions job={props.job} />
    </>
  );
};

const JobHeader = (props) => {
  const { job } = props;
  const [applicants, setApplicants] = useState(0);

  fetch(`/api/applications/${props.job.id}/applicants-count`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log(response).json();
    })
    .then((data) => {
      setApplicants(data);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <div className="pb-[3rem]">
      <div className="flex align-center mb-5">
        <span className="font-medium text-xl">Lab Name</span>
      </div>
      <div className="text-[2rem] font-bold text-black">{job.title}</div>
      <div className="text-[0.875rem] mt-4 text-black">
        {dateFormatter.format(new Date(job.created))} | {applicants} Applicant
        {applicants !== 1 && 's'}
      </div>
    </div>
  );
};

const JobDetails = (props) => {
  const { job } = props;

  return (
    <div className="grid grid-rows-3 grid-cols-3 grid-flow-row gap-4">
      <Detail title="Departments">Chemistry and Biochemistry</Detail>
      <Detail title="Location">Chemistry and Biochemistry</Detail>
      <Detail title="Position Type">Chemistry and Biochemistry</Detail>
      <Detail title="Desired Start Date">Chemistry and Biochemistry</Detail>
      <Detail title="Research Area">Chemistry and Biochemistry</Detail>
      <Detail title="Duration">Chemistry and Biochemistry</Detail>
      <Detail title="Approved For Credit">Chemistry and Biochemistry</Detail>
    </div>
  );
};

const JobActions = (props) => {
  const { job } = props;
  return (
    <div className="flex items-center gap-4 my-12">
      <button
        className="rounded-[50%] bg-[#F3F3F3] w-14 h-14 flex items-center justify-center"
        aria-label="Unsave Selected Job"
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="52" height="52" rx="26" fill="#F3F3F3" />
          <g clip-path="url(#clip0_2196_3219)">
            <path
              d="M30.2427 18.0104H21.7575C19.8826 18.0104 18.3599 19.5419 18.3599 21.408V33.8101C18.3599 35.3945 19.4953 36.0634 20.8861 35.2977L25.1815 32.9123C25.6392 32.657 26.3786 32.657 26.8275 32.9123L31.1229 35.2977C32.5136 36.0723 33.6491 35.4033 33.6491 33.8101V21.408C33.6403 19.5419 32.1175 18.0104 30.2427 18.0104Z"
              stroke="#1E2F97"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_2196_3219">
              <rect
                width="21.125"
                height="21.125"
                fill="white"
                transform="translate(15.4375 16.25)"
              />
            </clipPath>
          </defs>
        </svg>
      </button>
      <button className="bg-[#1E2F97] text-white font-extrabold text-base flex gap-3 items-center px-6 py-4 rounded-[32px]">
        Apply Internally
      </button>
    </div>
  );
};

const Detail = (props) => {
  return (
    <div className="flex h-30 w-30 flex-col">
      <h1 className="font-bold">{props.title}</h1>
      <p>{props.children}</p>
    </div>
  );
};

function formatField(data) {
  if (Array.isArray(data)) {
  } else {
  }
}

// const JobHeader= (props) => {
//   const { job } = props;

//   return (
//     <div className="p-6 w-full mx-auto flex text-left items-center space-x-4">
//       <div className="shrink-0"></div>
//       <div>
//         <div className="text-base font-medium text-black my-0.5">{job.title}</div>
//         <div className="text-base font-medium text-black my-0.5">Lab: {job.lab.name}</div>
//       </div>
//     </div>
//   );
// };

const JobTagNav = ({ children }) => {
  return (
    <div className="w-11/12 my-3 mx-auto px-3 py-2 bg-white rounded-lg text-black">
      <nav className="py-4 px-6 text-sm font-medium">
        <ul className="flex flex-row flex-wrap space-x-3">{children}</ul>
      </nav>
    </div>
  );
};

// TODO: when jobs sorted by group is setup, add href to each tag
const JobTagItem = ({ href, children = null }) => {
  if (!children) {
    return null;
  }
  return (
    <li>
      <a
        href={href}
        className={`block px-3 py-2 my-1 my rounded-md bg-violet-500 hover:bg-violet-600`}
      >
        {children}
      </a>
    </li>
  );
};

const JobHero = (props) => {
  const { job } = props;
  return (
    <div className="w-11/12 mx-auto p-6 w-full min-h-max bg-white rounded-lg shadow-md flex text-left text-black items-center space-x-4">
      <JobDescription description={job.description} />
    </div>
  );
};

const JobDescription = (props) => {
  const { description } = props;
  return (
    <div className="">
      <p className="text-md font-medium text-slate-500 mb-1.5">Description</p>
      {/* https://github.com/facebook/react/issues/19901 */}
      <div dangerouslySetInnerHTML={{ __html: description }} className="ql-editor !px-0" />
      {/* <p className="text-sm font-light leading-normal">{description}</p> */}
    </div>
  );
};

export async function getStaticProps(context) {
  const jobId = parseInt(context.params.jobId, 10);
  if (Number.isNaN(jobId)) {
    return { notFound: true };
  }

  // format of props
  const job = await prisma.job.findUnique({
    select: {
      created: true,
      id: true,
      title: true,
      description: true,
      departments: true,
      duration: true,
      closingDate: true,
      lab: {
        select: { name: true },
      },
    },
    where: { id: jobId },
  });
  // console.log({ job });
  if (!job) {
    return { notFound: true };
  }
  return {
    props: {
      job: {
        ...job,
        created: JSON.parse(JSON.stringify(job.created)),
        ...(job.closingDate && { closingDate: JSON.parse(JSON.stringify(job.closingDate)) }),
      },
    },
  };
}

export async function getStaticPaths() {
  // returns array containing jobId
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
    },
  });

  const paths = jobs.map((job) => ({
    params: { jobId: job.id.toString(10) },
  }));

  return { paths, fallback: 'blocking' };
}

export default Job;
