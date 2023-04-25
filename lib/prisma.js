import { PrismaClient } from '@prisma/client';

/** @type {PrismaClient} */
let prisma;

// check if we are running in production mode
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // check if there is already a connection to the database
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
