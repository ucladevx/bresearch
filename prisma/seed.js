const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // const researcherMe = await prisma.researcher.upsert({
  //   where: { email: process.env.EMAIL },
  //   create: {
  //     email: 'johndoe@g.ucla.edu',
  //   },
  //   update: {},
  // });
  let labA = await prisma.lab.findFirst({
    where: {
      name: 'Research Lab 1',
    },
  });
  if (!labA) {
    labA = await prisma.lab.create({
      data: { name: 'Research Lab 1' },
    });
  }
  const researcherA = await prisma.researcher.upsert({
    where: { email: 'johndoe@g.ucla.edu' },
    create: {
      email: 'johndoe@g.ucla.edu',
      labs: {
        connect: {
          id: labA.id,
        },
      },
    },
    update: {
      labs: {
        connect: {
          id: labA.id,
        },
      },
    },
  });

  const studentB = await prisma.student.upsert({
    where: {
      email: 'janedoe@g.ucla.edu', // or your email here for debug purposes
    },
    create: {
      // firstName: 'Jane',
      // preferredName: 'Jane',
      // lastName: 'Doe',
      email: 'janedoe@g.ucla.edu',
      studentProfile: {
        create: {
          firstName: 'Jane',
          lastName: 'Doe',
          bio: 'Biography',
          major: 'COGNITIVE_SCIENCE',
          graduationDate: 'Spring 2026',
          gpa: '4.0',
          majorGpa: '4.0',
          pronouns: 'SHE_HER',
        },
      },
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
      poster: {
        connect: {
          id: researcherA.id,
        },
      },
      lab: {
        connect: {
          id: labA.id,
        },
      },
    },
    update: {},
  });

  const trackedJob = await prisma.labeledJob.upsert({
    where: {
      jobId_applicantId: {
        jobId: job.id,
        applicantId: studentB.id,
      },
    },
    create: {
      jobId: job.id,
      applicantId: studentB.id,
      bookmarked: true,
      status: 'SAVED',
      piStatus: 'CONSIDERING',
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
