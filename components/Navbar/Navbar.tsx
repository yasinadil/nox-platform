import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Avatar from "../../assets/user.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAccount } from "wagmi";

function Navbar() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  return (
    <div className="navbar bg-transparent desktop:pt-8 desktop:px-8 mobile:pt-8 mobile:px-2 ">
      <div className="flex-1">
        <Link href="/" className="title desktop:text-4xl mobile:text-3xl">
          Nox
        </Link>
      </div>
      <div className=" gap-2">
        <Link
          href="/swap"
          className="hide-mobile desktop:mr-2 mobile:mr-0 text-center bg-[#FF7A01] px-4 py-2 rounded-lg text-white font-bold"
        >
          Launch DApp
        </Link>

        <ConnectButton />
        <div className="avatar online cursor-pointer">
          <div className=" rounded-full">
            {isConnected && (
              <Link href={`/account/${userAddress}`}>
                <Image
                  src={Avatar}
                  alt="avatar"
                  priority={true}
                  width={40}
                  height={30}
                />
              </Link>
            )}

            {!isConnected && (
              <Link href={`/account`}>
                <Image
                  src={Avatar}
                  alt="avatar"
                  priority={true}
                  width={40}
                  height={30}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
