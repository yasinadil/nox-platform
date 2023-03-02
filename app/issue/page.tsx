"use client";
import { useState } from "react";
import Link from "next/link";
import { Web3Storage } from "web3.storage";
import Image from "next/image";
import IssueDApp from "../../components/IssueDApp/IssueDApp";
import upload from "../../assets/upload.png";
import logo from "../../assets/logo.png";
import twitter from "../../assets/twitter.png";
import facebook from "../../assets/facebook.png";
import discord from "../../assets/discord.png";
import etherscan from "../../assets/etherscan.png";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Issue() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/signin");
    }
  }, [router, status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="hero min-h-screen bg-[#120F22]">
        <div className="hero-content text-center bg-transparent">
          <p className="text-purple-800">Loading </p>
          <progress className="progress w-56"></progress>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#120F22] grid desktop:grid-cols-5 laptop:grid-cols-5 mobile:grid-cols-5 desktop:gap-4 mobile:gap-0">
      <div className="text-center border-r-2 border-[#7000FF]">
        <div className="desktop:col-span-1 laptop:col-span-1 mobile:col-span-2">
          <div className="desktop:py-24 mobile:py-20">
            <Link className="title desktop:text-4xl mobile:text-xl" href="/">
              Nox
            </Link>
          </div>

          <div className="w-full desktop:pt-[10vh] mobile:pt-20">
            <ul className="w-full  text-cyan-100 text-center">
              <li className="border-t-2 border-[#7000FF]">
                <Link
                  href="/swap"
                  className="flex cursor-pointer justify-center py-3 bg-transparent"
                >
                  Swap
                </Link>
              </li>
              <li className="border-t-2 border-b-2 border-[#7000FF]">
                <Link
                  href="/issue"
                  className="flex cursor-pointer justify-center py-3 bg-[#2E2BC9]"
                >
                  Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center desktop:mt-[20vh] laptop:mt-[16vh] mobile:mt-12">
          <Image className="" style={{ width: "12vh" }} src={logo} alt="logo" />
        </div>
        <div className="mt-6 desktop:visible mobile:invisible">
          <Image
            className="inline mx-3"
            style={{ width: "4vh" }}
            src={facebook}
            alt="logo"
          />

          <Image
            className="inline mx-3"
            style={{ width: "4vh" }}
            src={twitter}
            alt="logo"
          />

          <Image
            className="inline mx-3"
            style={{ width: "4vh" }}
            src={discord}
            alt="logo"
          />

          <Image
            className="inline mx-3"
            style={{ width: "4vh" }}
            src={etherscan}
            alt="logo"
          />
        </div>
      </div>

      <IssueDApp />
    </div>
  );
}

export default Issue;
