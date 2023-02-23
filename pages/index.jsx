import { PrismaClient } from '@prisma/client';
import Job from './job/[jobId]';

const prisma = new PrismaClient();

function Home(props) {
  return (
    <div>
      {props.jobs.map((job) => (
        <Job job={job} key={job.id} />
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
      departments: true,
      duration: true,
      careerGoals: true,
    },
  });

  return {
    props: { jobs },
  };
}

export default Home;
