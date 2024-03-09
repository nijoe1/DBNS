import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { useRouter } from "next/router";

const { chains, publicClient } = configureChains([sepolia], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "ad9d4173328447d73a95b113fec565eb",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const id = "";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#7b3fe4",
            accentColorForeground: "white",
            fontStack: "system",
          })}
          chains={chains}
        >
          <div className="fixed z-50 top-0 left-0 w-full">
            <Navbar />
          </div>{" "}
          <div className="w-screen h-screen bg-gradient-to-b from-gray-400  to-gray-400 mt-[6%]">
            <Component {...pageProps} />
          </div>
          <Footer />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
