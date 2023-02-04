import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useAccount } from "wagmi";

function Navbar() {
  const { address, isConnected } = useAccount();
  return (
    <div className="navbar bg-transparent desktop:pt-8 desktop:px-8 mobile:pt-8 mobile:px-2">
      <div className="flex-1">
        <Link href="/" className="title desktop:text-4xl mobile:text-3xl">
          Nox
        </Link>
      </div>
      <div className=" gap-2">
        <Link
          href="/swap"
          className="desktop:visible mobile:invisible desktop:mr-2 mobile:mr-0 text-center bg-[#5AABFF] px-4 py-2 rounded-lg"
        >
          Launch DApp
        </Link>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Navbar;
