"use client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { ClerkProvider } from "@clerk/nextjs/app-beta";

const myCustomTheme: Theme = {
  blurs: {
    modalOverlay: "blur(5px)",
  },
  colors: {
    accentColor: "#FF7A01",
    accentColorForeground: "#ffffff",
    actionButtonBorder: "#00000000",
    actionButtonBorderMobile: "#00000000",
    actionButtonSecondaryBackground: "...",
    closeButton: "#FF7A01",
    closeButtonBackground: "...",
    connectButtonBackground: "#FF7A01",
    connectButtonBackgroundError: "#FF7A01",
    connectButtonInnerBackground: "...",
    connectButtonText: "...",
    connectButtonTextError: "...",
    connectionIndicator: "...",
    downloadBottomCardBackground: "...",
    downloadTopCardBackground: "...",
    error: "...",
    generalBorder: "#00000000",
    generalBorderDim: "#00000000",
    menuItemBackground: "#FF7A01",
    modalBackdrop: "...",
    modalBackground: "#120F22",
    modalBorder: "#8347E6",
    modalText: "#8347E6",
    modalTextDim: "...",
    modalTextSecondary: "#5AABFF",
    profileAction: "#00000000",
    profileActionHover: "...",
    profileForeground: "...",
    selectedOptionBorder: "#5AABFF",
    standby: "...",
  },
  fonts: {
    body: "Lexend",
  },
  radii: {
    actionButton: "12px",
    connectButton: "10px",
    menuButton: "8px",
    modal: "8px",
    modalMobile: "10px",
  },
  shadows: {
    connectButton: "...",
    dialog: "...",
    profileDetailsAction: "...",
    selectedOption: "...",
    selectedWallet: "...",
    walletLogo: "...",
  },
};

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_AlchemyAPI ?? "",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Nox Platform",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <head />
        {/* <ClerkProvider> */}
        <body cz-shortcut-listen="true">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <WagmiConfig client={wagmiClient}>
            <SessionProvider refetchInterval={0}>
              <RainbowKitProvider theme={myCustomTheme} chains={chains}>
                {children}
              </RainbowKitProvider>
            </SessionProvider>
          </WagmiConfig>
        </body>
        {/* </ClerkProvider> */}
      </html>
    </>
  );
}
