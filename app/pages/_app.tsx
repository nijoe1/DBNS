import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig, lightTheme } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";
import ReduxProvider from "@/providers/ReduxProvider";
import {
	darkTheme,
	getDefaultWallets,
	RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import { useRouter } from "next/router";

const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "ad9d4173328447d73a95b113fec565eb",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

const id = "";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ChakraProvider>
      <WagmiProvider config={config}>
        <ReduxProvider>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={darkTheme({
                accentColor: "#f85858",
                accentColorForeground: "white",
                borderRadius: "large",
                fontStack: "system",
                overlayBlur: "small",
              })}
              modalSize="compact"
            >
              <div className="fixed z-50 top-0 left-0 w-full">
                <Navbar />
              </div>{" "}
              <div className="w-screen h-screen bg-gradient-to-b from-gray-400  to-gray-400 mt-[6%]">
                <Component {...pageProps} />
              </div>
              <Footer />
            </RainbowKitProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
}
