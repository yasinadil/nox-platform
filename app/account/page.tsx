"use client";
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Account() {
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log(status);

  useEffect(() => {
    if (isConnected && session && status == "authenticated") {
      router.replace(`/account/${address}`);
    }
  }, [isConnected, address, router]);
  return (
    <div className="hero min-h-screen bg-[#120F22]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            It looks like you have not connected your wallet, please connect
            your wallet to access the Nox Platform.
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
