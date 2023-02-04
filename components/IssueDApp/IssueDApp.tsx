import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ethers, BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { Web3Storage } from "web3.storage";
import upload from "../../assets/upload.png";
import logo from "../../assets/logo.png";
import twitter from "../../assets/twitter.png";
import facebook from "../../assets/facebook.png";
import discord from "../../assets/discord.png";
import etherscan from "../../assets/etherscan.png";

function Issue() {
  const { address, isConnected } = useAccount()
  const [issueeWallet, setIssueeWallet] = useState("")
  const [fileState, setFile] = useState<FileList | null>(null);
  const [provider, setProvider] = useState({});

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      setProvider(provider);
    }
  }, []);


  return (
    <div className="desktop:col-span-4 mobile:col-span-4 desktop:mx-auto desktop:my-auto mobile:mx-auto mobile:mt-24 desktop:w-3/4 mobile:w-full">
      <h1 className="text-center pb-6 desktop:text-2xl mobile:text-base">
        Issue Document to User
      </h1>

      <form className="">
        <div className="desktop:px-12 mobile:px-3 pt-6 pb-10 bg-[#181527] desktop:mx-0 mobile:mx-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <label className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Your Wallet Address:
            </label>
            <input
              className="border border-gray-400 p-2 w-full rounded-2xl text-black"
              type="text"
              value={`${isConnected ? address : 'Please connect your wallet'}`}
              readOnly
            />
          </div>
          <div className="flex flex-col mb-6">
            <label className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Issuee Wallet Address:
            </label>
            <input
              className="border border-gray-400 p-2 w-full rounded-2xl text-black"
              type="email"
              value={issueeWallet}
              onChange={(e) => setIssueeWallet(e.target.value)}
              placeholder="Enter issuee wallet address"
            />
          </div>

          <p className="my-4 desktop:text-lg mobile:text-sm">Upload document</p>

          <input
            type="file"
            className="w-full"
            onClick={(e) => {
              const file = (e.target as HTMLInputElement).files;
              setFile(file);
            }}
          />
          <div className="pt-8">
            <button className="bg-[#7000FF] text-white py-2 px-8 rounded-2xl desktop:text-lg mobile:text-sm">
              Issue
            </button>
          </div>
        </div>
      </form>
      <div className="mt-10 mobile:visible desktop:invisible">
        <div className="flex justify-center">
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
    </div>
  );
}
export default Issue;
