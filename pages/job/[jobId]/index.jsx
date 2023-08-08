import prisma from '@lib/prisma';
import 'react-quill/dist/quill.snow.css';

function Job(props) {
  return (
    <div className="max-w-full min-h-screen justify-items-center text-center mx-auto bg-blue-500 shadow-md flex flex-col items-center space-x-4">
      <JobWrapper job={props.job} />
      <ActionMenu />
    </div>
  );
}

const JobWrapper = (props) => {
  const { job } = props;
  const { departments, duration } = job;

  return (
    <div className="w-10/12 pb-8 min-h-screen bg-blue-500">
      <JobHeading job={job} />
      <JobTagNav>
        {departments.length > 0 ? (
          departments.map((department) => <JobTagItem key={department}>{department}</JobTagItem>)
        ) : (
          <JobTagNav>No departments found</JobTagNav>
        )}
        {<JobTagItem>{duration}</JobTagItem>}
      </JobTagNav>

      <JobHero job={job} />
    </div>
  );
};

const JobHeading = (props) => {
  const { job } = props;

  return (
    <div className="p-6 w-full mx-auto bg-white border border-gray-400 shadow-md flex text-left items-center space-x-4">
      <div className="shrink-0">
        <img
          className="h-16 w-16 mx-1 bg-black"
          src="https://www.w3schools.com/images/lamp.jpg"
          alt="img"
        />
      </div>
      <div>
        <div className="text-base font-medium text-black my-0.5">{job.title}</div>
        <div className="text-base font-medium text-black my-0.5">Lab: {job.lab.name}</div>
      </div>
    </div>
  );
};

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

const ActionMenu = ({ href }) => {
  return (
    <div className="fixed w-5/12 bottom-0 z-50">
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex justify-center space-x-4">
            <button className="w-3/12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded mr-2">
              Save
            </button>
            <button className="w-3/12 bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps(context) {
  const jobId = parseInt(context.params.jobId, 10);
  if (Number.isNaN(jobId)) {
    return { notFound: true };
  }

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
