import { initTRPC } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';


export const createContext = async (opts: CreateNextContextOptions) => {
    const session = await getSession({ req: opts.req });

    return {
        session,
    }
}

const t = initTRPC.context<typeof createContext>().create();
t1.procedure.use(({ ctx }) => { ... });


export const publicProcedure = t.procedure;
export const router = t.router;