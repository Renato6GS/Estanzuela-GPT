import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import useThemeStore from "../store/useThemeStore";

export default function App({ Component, pageProps }: any) {
  const theme = useThemeStore((state) => state.theme);

  return (
    <MantineProvider theme={theme} defaultColorScheme={"auto"}>
      <Head>
        <title>Estanzuela GPT</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.webp" />
      </Head>
      <Component {...pageProps} />
    </MantineProvider>
  );
}
