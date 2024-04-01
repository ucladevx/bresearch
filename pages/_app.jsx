import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { Kumbh_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  variable: '--font-kumbh-sans',
  fallback: ['sans-serif'],
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class">
          <div className={`${kumbhSans.variable} font-sans`}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
