import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function Job(props) {
  // TODO: Display Job title, description, created Date, Lab name
  return (
    <div className="max-w-full min-h-screen justify-items-center text-center mx-auto bg-black shadow-md flex flex-col items-center space-x-4">
      <JobWrapper job={props.job} />
    </div>
  );
}

const JobWrapper = (props) => {
  return (
    <div className="w-10/12 min-h-screen">
      <JobHeading job={props.job} />
      <JobHero description={props.job.description} />
    </div>
  );
};

const JobHeading = (props) => {
  return (
    <div className="p-6 w-full mx-auto bg-white rounded-xl shadow-md flex text-left items-center space-x-4">
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
        <p className="text-xs text-slate-500 my-1">Posted about 69 hours ago</p>
      </div>
    </div>
  );
};

const JobHero = (props) => {
  return (
    <div className="p-6 w-full mx-auto bg-green-300 rounded-xl shadow-md flex items-center space-x-4">
      {props.description}
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
