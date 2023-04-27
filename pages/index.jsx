// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import HomePage from './HomePage';
import prisma from '@lib/prisma';

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
