import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { Kumbh_Sans } from 'next/font/google';

const kumbhSans = Kumbh_Sans({ subsets: ['latin'], fallback: ['sans-serif'] });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <div className={kumbhSans.className}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}

export default MyApp;
