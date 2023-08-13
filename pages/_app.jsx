import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { Kumbh_Sans } from 'next/font/google';

const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-kumbh-sans',
  fallback: ['sans-serif'],
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div className={`${kumbhSans.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
