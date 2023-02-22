import { PrismaClient } from '@prisma/client';
import JobsPage from './SearchComponents/JobsPage';

const prisma = new PrismaClient();
function Home(props) {
  return (
    <div>
      <JobsPage jobs={props.jobs} />
      {/* {props.jobs.map((displayedJobs) => (
        <ul key={job.id}>
          <li>{job.title}</li>
          <li>Job Description: {job.description}</li>
          {job.lab && <li>Lab Name: {job.lab.name}</li>}
        </ul>
      ))} */}
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
