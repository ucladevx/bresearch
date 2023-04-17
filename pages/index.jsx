import { PrismaClient } from '@prisma/client';
import HomePage from './HomePage';
const prisma = new PrismaClient();
function Home(props) {
  return (
    <div>
      <HomePage jobs={props.jobs} />
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
    },
  });

  return {
    props: { jobs },
  };
}

export default Home;
