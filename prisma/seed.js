const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // const userA = await prisma.user.upsert({
  //   where: { email: 'johndoe@g.ucla.edu' },
  //   create: {
  //     email: 'johndoe@g.ucla.edu',
  //   },
  //   update: {},
  // });
  const researcherA = await prisma.researcher.upsert({
    where: { email: 'johndoe@g.ucla.edu' },
    create: {
      // firstName: 'John',
      // lastName: 'Doe',
      email: 'johndoe@g.ucla.edu',
      // user: {
      //   connect: { email: 'johndoe@g.ucla.edu' },
      // },
    },
    update: {},
  });
  // const userB = await prisma.user.upsert({
  //   where: { email: 'janedoe@g.ucla.edu' },
  //   create: {
  //     email: 'janedoe@g.ucla.edu',
  //   },
  //   update: {},
  // });

  const studentB = await prisma.student.upsert({
    where: {
      email: 'janedoe@g.ucla.edu', // or your email here for debug purposes
    },
    create: {
      // firstName: 'Jane',
      // preferredName: 'Jane',
      // lastName: 'Doe',
      email: 'janedoe@g.ucla.edu',
      // user: {
      //   connect: { email: 'janedoe@g.ucla.edu' },
      // },
    },
    update: {},
  });

  const job = await prisma.job.upsert({
    where: { id: 1 },
    create: {
      closingDate: new Date(),
      closed: false,
      title: 'test job',
      description: 'test job description',
      paid: true,
      duration: 'QUARTERLY',
      weeklyHours: 10,
      credit: true,
      location: 'ON_CAMPUS',
      posters: {
        connect: [{ email: researcherA.email }],
      },
    },
    update: {},
  });

  const trackedJob = await prisma.labeledJob.upsert({
    where: {
      jobId_applicantEmail: {
        jobId: job.id,
        applicantEmail: studentB.email,
      },
    },
    create: {
      jobId: job.id,
      applicantEmail: studentB.email,
      bookmarked: true,
      status: 'SAVED',
    },
    update: {},
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
