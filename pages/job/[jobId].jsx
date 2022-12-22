import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function Job(props) {
  // TODO: Display Job title, description, created Date, Lab name
  return (
    <ul>
      <li>{props.job.title}</li>
      <li></li>
    </ul>
  );
}

export async function getStaticProps(context) {
  // TODO: change prisma query using findUnique and context. Only select needed columns
  const job = await prisma.job.findFirst({ include: { posters: true, lab: true } });
  // console.log({ job });
  return {
    props: { job: { ...job, created: JSON.parse(JSON.stringify(job.created)) } },
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
