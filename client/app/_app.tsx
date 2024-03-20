import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}
