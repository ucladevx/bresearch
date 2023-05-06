import prisma from '@lib/prisma';

function Home(props) {
  return (
    <div>
      {props.jobs.map((job) => (
        <ul key={job.id}>
          <li>{job.title}</li>
          <li>Job Description: {job.description}</li>
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
    },
  });

  return {
    props: { jobs },
  };
}

export default Home;
