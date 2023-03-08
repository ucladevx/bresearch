const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const lab = await prisma.lab.upsert({
    where: { slug: '12345678' },
    create: {
      name: 'my lab',
      slug: '12345678',
      description: 'lab description',
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
      labId: lab.id,
      paid: true,
      duration: 'QUARTERLY',
      weeklyHours: 10,
      credit: true,
    },
    update: {},
  });

  const researcherA = await prisma.researcher.upsert({
    where: { email: 'johndoe@g.ucla.edu' },
    create: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@g.ucla.edu',
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
