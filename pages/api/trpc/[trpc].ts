import * as trpcNext from '@trpc/server/adapters/next';
import { publicProcedure, router } from '../../../trpc.js'
import { z } from 'zod';
import { Prisma } from 'prisma/prisma-client';


const appRouter = router({
    jobs: publicProcedure
        .input(
            z.object({
                studentid: z.string()
            })
        )
        .query(({ input }) => {
            console.log(input)
            let result = input.prisma.job.findMany({
                where: {
                    closed: false,
                    closingDate: { gt: new Date() },
                    title: {
                        contains: input,
                        mode: 'insensitive',
                    },
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    departments: true,
                    duration: true,
                    location: true,
                    lab: { select: { name: true } },
                    created: true,
                    startDate: true,
                    closingDate: true,
                    credit: true,
                    weeklyHours: true,
                    paid: true,
                    externalLink: true,
                    _count: {
                        select: {
                            applicants: { where: { status: 'APPLIED' } },
                        },
                    },
                },
                take: 50,
            });
        })
})