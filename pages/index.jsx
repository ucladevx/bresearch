import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Home(props) {
  return (
    <div>
      {props.jobs.map((job) => (
        <ul key={job.id}>
          <li>{job.title}</li>
          <li>Job Description: {job.description}</li>
          <li>Lab Name: {job.lab.name}</li>
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
