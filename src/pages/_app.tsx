/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'
import store from '@/src/app/store'
import '../../styles/globals.css'

const CDICDashboardApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Provider store={store}>
        <Head>
          <title>PrimaKu | CDIC</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}
export default CDICDashboardApp
