import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
const prisma = new PrismaClient();

function Job(props) {
  // TODO: Display Job title, description, created Date, Lab name
  return (
    <div className="max-w-full min-h-screen justify-items-center text-center mx-auto bg-gray-200 shadow-md flex flex-col items-center space-x-4">
      <JobWrapper job={props.job} />
      <ActionMenu />
    </div>
  );
}

const JobWrapper = (props) => {
  const { job } = props;
  // extracts unique departments from `job.departments`
  const departments =
    job &&
    job.departments &&
    job.departments.reduce((acc, curr) => {
      if (acc.indexOf(curr) === -1) {
        acc.push(curr);
      }
      return acc;
    }, []);
  const duration = job.duration;
  const careerGoals = job.careerGoals;

  return (
    <div className="w-10/12 pb-8 min-h-screen bg-gray-300">
      <JobHeading job={props.job} />
      <JobTagNav>
        {Array.isArray(departments) && departments.length > 0 ? (
          departments.map((department, index) => <JobTagItem key={index}>{department}</JobTagItem>)
        ) : (
          <JobTagNav>No departments found</JobTagNav>
        )}
        {duration && <JobTagItem>{duration}</JobTagItem>}
        {careerGoals && <JobTagItem>{careerGoals}</JobTagItem>}
      </JobTagNav>

      <JobHero job={job} />
    </div>
  );
};

const JobHeading = (props) => {
  const { job } = props;

  // compute the age of the post (rounded up, calculated in days)
  const currentTime = DateTime.local().toUTC();
  const postedTime = DateTime.fromISO(job.created).toUTC();
  const postAge = Math.ceil(currentTime.diff(postedTime).as('days'));

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
        <div className="text-base font-medium text-black my-0.5">{props.job.title}</div>
        <div className="text-sm font-light text-black my-0.5">
          {props.job.lab && props.job.lab.name}
        </div>
        <p className="text-xs text-slate-500 my-1">Posted {postAge} days ago</p>
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
    <div className="w-11/12 mx-auto p-6 w-full min-h-max mx-auto bg-white rounded-lg shadow-md flex text-left text-black items-center space-x-4">
      <JobDescription description={job.description} />
    </div>
  );
};

const JobDescription = (props) => {
  const { description } = props;
  return (
    <div className="">
      <p className="text-md font-medium text-slate-500 mb-1.5">Description</p>
      <p className="text-sm font-light leading-normal">{description}</p>
    </div>
  );
};

const ActionMenu = ({ href }) => {
  return (
    <div class="fixed w-5/12 bottom-0 z-50">
      <div class="bg-white border border-gray-300 rounded-lg shadow-lg">
        <div class="p-4">
          <div class="flex justify-center space-x-4">
            <button class="w-3/12 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded mr-2">
              Save
            </button>
            <button class="w-3/12 bg-blue-500 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export async function getStaticProps(context) {
  // TODO: change prisma query using findUnique and context. Only select needed columns
  const job = await prisma.job.findFirst({ include: { posters: true, lab: true } });
  // console.log({ job });
  return {
    props: {
      job: {
        ...job,
        created: JSON.parse(JSON.stringify(job.created)),
        closingDate: JSON.parse(JSON.stringify(job.closingDate)),
      },
    },
  };
}

export async function getStaticPaths() {
  // TODO: change prisma query. Only select needed column(s)
  const jobs = await prisma.job.findMany();

  const paths = jobs.map((job) => ({
    params: { jobId: job.id.toString(10) },
  }));

  return { paths, fallback: false };
}

export default Job;
