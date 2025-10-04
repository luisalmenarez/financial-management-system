import { Toaster } from 'sonner';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Component {...pageProps} />
    <Toaster position='top-right' richColors />
  </>
);

export default App;
