"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../assets/user.png";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/logo.png";
import { useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";

function Navbar() {
  const [userAddress, setUserAddress] = useState("");
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address != undefined) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  return (
    <div className="navbar bg-[#120F22] desktop:pt-8 desktop:px-8 laptop:pt-8 laptop:px-8 mobile:pt-8 mobile:px-2 ">
      <div className="flex-1">
        <Link
          href="/"
          className="title desktop:text-6xl laptop:text-5xl mobile:text-3xl"
        >
          Nox
        </Link>
      </div>
      <div className=" gap-2">
        <Link
          href="/signin"
          className="hide-mobile desktop:mr-2 mobile:mr-0 text-center bg-[#FF7A01] px-4 py-2 rounded-lg text-white font-bold"
        >
          Launch DApp
        </Link>

        {session && (
          <Link
            href={`/api/auth/signout`}
            className="desktop:mr-2 mobile:mr-0 text-center bg-[#FF7A01] px-4 py-2 rounded-lg text-white font-bold"
            onClick={(e) => {
              e.preventDefault();
              disconnect();
              signOut();
            }}
          >
            Sign out
          </Link>
        )}

        {/* <ConnectButton /> */}
        <div className="avatar online cursor-pointer">
          <div className=" rounded-full">
            {isConnected ? (
              <Link href={`/account/${userAddress}`}>
                <Image
                  src={Avatar}
                  alt="avatar"
                  priority={true}
                  width={40}
                  height={30}
                />
              </Link>
            ) : (
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
