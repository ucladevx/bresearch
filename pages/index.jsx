// import { PrismaClient } from '@prisma/client';
// import Job from './job/[jobId]';

// const prisma = new PrismaClient();

// function Home(props) {
//   return (
//     <div>
//       {props.jobs.map((job) => (
//         <Job job={job} key={job.id} />
//       ))}
//     </div>
//   );
// }

// export async function getStaticProps() {
//   const jobs = await prisma.job.findMany({
//     select: {
//       created: true,
//       id: true,
//       title: true,
//       description: true,
//       lab: {
//         select: {
//           name: true,
//         },
//       },
//       departments: true,
//       duration: true,
//       careerGoals: true,
//     },
//   });

//   const jobsWithDateString = jobs.map((job) => ({
//     ...job,
//     created: job.created.toISOString(),
//   }));

//   return {
//     props: { jobs: jobsWithDateString },
//   };
// }

// export default Home;

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Home(props) {
  return (
    <div>
      {props.jobs.map((job) => (
        <ul key={job.id}>
          <li>{job.title}</li>
          <li>Job Description: {job.description}</li>
          {job.lab && <li>Lab Name: {job.lab.name}</li>}
        </ul>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const jobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      lab: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    props: { jobs },
  };
}

export default Home;
