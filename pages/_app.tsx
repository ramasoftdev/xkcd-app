import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { NextUIProvider } from '@nextui-org/react';
import Head from 'next/head';
import { I18NProvider } from '../context/i18n';

function MyApp({ Component, pageProps }: AppProps) {
  return (

    <NextUIProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <I18NProvider>
        <Component {...pageProps} />
      </I18NProvider>
    </NextUIProvider>
  );
}

export default MyApp
