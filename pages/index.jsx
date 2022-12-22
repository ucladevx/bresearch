import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Home(props) {
  // TODO: Display Job title, description, Lab name
  return (
    <div>
      {props.jobs.map((job) => (
        <ul key={job.id}>
          <li>Job: {job.title}</li>
          <li></li>
        </ul>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  // TODO: change prisma query. Only select needed columns
  const jobs = (await prisma.job.findMany({ include: { lab: true } })).map((job) => ({
    ...job,
    created: JSON.parse(JSON.stringify(job.created)),
  }));

  return {
    props: { jobs },
  };
}

export default Home;
