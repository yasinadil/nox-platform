"use client";
import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Web3Storage } from "web3.storage";
import { ToastContainer, toast } from "react-toastify";
import { noxPlatform } from "../../Config";
import "react-toastify/dist/ReactToastify.css";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import Link from "next/link";
const ethUtil = require("ethereumjs-util");
const sigUtil = require("@metamask/eth-sig-util");
const noxPlatformABI = require("../../components/ABI/noxPlatformABI.json");

interface User {
  name: string;
  walletAddress: string;
  internalWalletAddress: string;
  publicKey: string;
}

function Issue() {
  const { address, isConnected } = useAccount();
  const [issueeWallet, setIssueeWallet] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileDesc, setFileDesc] = useState("");
  const [fileState, setFile] = useState<FileList | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState<User | null>(null);
  const [newLink, setNewLink] = useState("");
  const [generateLink, setGenerateLink] = useState(false);

  const findUserKey = async (searchWallet) => {
    const headers = {
      "Content-Type": "application/json",
    };
    fetch("/api/getUserEncKey", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        walletAddress: searchWallet,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (data.message === "User not found") {
          setSearch(null);
        } else {
          setSearch(data.message);
        }
      });
  };

  const getNewTokenID = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(noxPlatform, noxPlatformABI, signer);
    let tokenid = await contract.docCount();
    const newTokenID = Number(tokenid) - 1;
    setNewLink(`https://nox-platform.vercel.app/token/${newTokenID}`);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileState == null) {
      console.log("no");
      toast.error("No file uploaded", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      const data = await toast.promise(getCid(), {
        pending: "Uploading Document This can take a moment... ⏳",
        success: "Documemt Uploaded! 🎉",
        error: "Something went wrong! 😢",
      });

      if (data !== undefined) {
        const [name, url] = data;

        if (url) {
          await toast.promise(handleMint(issueeWallet, url), {
            pending: "Minting your Document into an NFT... ⏳",
            success: "NFT Minted! 🎉",
            error: "Something went wrong! 😢",
          });
        }
      }
    }
  };

  const getCid = async () => {
    // Construct with token and endpoint
    const client = new Web3Storage({
      token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN!,
    });
    try {
      if (fileState != null) {
        const rootCid = await client.put(fileState, {
          wrapWithDirectory: false,
        });
        console.log("CID" + rootCid);
        const url = "ipfs://" + rootCid + "/";
        const obj = {
          name: fileName,
          description: fileDesc,
          issuer: address,
          issuee: issueeWallet,
          date: Math.floor(Date.now() / 1000),
          image: url,
        };
        const blob = new Blob([JSON.stringify(obj)], {
          type: "application/json",
        });

        const metadataFile = [new File([blob], "metadata.json")];
        const cid = await client.put(metadataFile, {
          wrapWithDirectory: false,
        });
        console.log("metadatfile cid " + " " + cid);

        const urlMeta = "ipfs://" + cid + "/";
        return [name, urlMeta];
      }
    } catch (error: any) {
      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleMint = async (issuee: string, url: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(noxPlatform, noxPlatformABI, signer);
    try {
      //encrypt url
      if (isChecked && search !== null) {
        const encryptedMessage = ethUtil.bufferToHex(
          Buffer.from(
            JSON.stringify(
              sigUtil.encrypt({
                publicKey: search.publicKey,
                data: url,
                version: "x25519-xsalsa20-poly1305",
              })
            ),
            "utf8"
          )
        );
        const headers = {
          "Content-Type": "application/json",
        };
        fetch("/api/getUserEncKey", {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            walletAddress: address,
          }),
        })
          .then((response) => response.json())
          .then(async (data) => {
            console.log(data.message);
            if (data.message === "User not found") {
              toast.error("Error occurred!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            } else {
              const encryptedMessageIssuer = ethUtil.bufferToHex(
                Buffer.from(
                  JSON.stringify(
                    sigUtil.encrypt({
                      publicKey: data.message.publicKey,
                      data: url,
                      version: "x25519-xsalsa20-poly1305",
                    })
                  ),
                  "utf8"
                )
              );
              const response = await contract.issue(
                issuee,
                fileDesc,
                encryptedMessage,
                encryptedMessageIssuer,
                isChecked
              );
              await provider.waitForTransaction(response.hash);
              setGenerateLink(true);
              await getNewTokenID();
            }
          });
      } else {
        const response = await contract.issue(
          issuee,
          fileDesc,
          url,
          "",
          isChecked
        );
        await provider.waitForTransaction(response.hash);
        setGenerateLink(true);
        await getNewTokenID();
      }
    } catch (error: any) {
      console.log(error);

      let message = error.reason;
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <div className="desktop:col-span-4 mobile:col-span-4 desktop:mx-auto desktop:my-auto laptop:mx-auto laptop:my-auto mobile:mx-auto mobile:mt-8 desktop:w-3/4 laptop:w-3/4 mobile:w-full">
        <div className="hero min-h-screen">
          <div className="hero-content p-0">
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

            <form className="" onSubmit={(e) => handleSubmit(e)}>
              <h1 className="text-center py-3 desktop:text-2xl mobile:text-base bannerHeading">
                Issue Document to User
              </h1>
              <div className="desktop:px-12 mobile:px-3 pt-4 pb-6 bg-[#181527] desktop:mx-0 mobile:mx-6">
                <div className="flex flex-col md:flex-row md:items-center mb-6">
                  <label className="desktop:text-base mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
                    Your Wallet Address:
                  </label>
                  <input
                    className="border border-gray-400 p-2 w-[50vw] rounded-2xl text-black"
                    type="text"
                    value={`${
                      isConnected ? address : "Please connect your wallet"
                    }`}
                    readOnly
                  />
                </div>
                <div className="flex flex-col mb-6">
                  <label className="desktop:text-base mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
                    Issuee Wallet Address:
                  </label>
                  <input
                    className="border border-gray-400 p-2 w-[50vw] rounded-2xl text-black"
                    type="text"
                    value={issueeWallet}
                    onChange={(e) => {
                      setIssueeWallet(e.target.value);
                      setTimeout(async () => {
                        await findUserKey(e.target.value);
                      }, 1000);
                    }}
                    placeholder="Enter issuee wallet address"
                    required
                  />
                </div>
                {search !== null && (
                  <div className="bg-white rounded-lg p-2 text-black shadow">
                    <div className="flex gap-x-2 items-center">
                      {" "}
                      <p className="text-lg">User Found</p> <DoneIcon />
                    </div>

                    <p className="text-xl">Name: {search.name}</p>
                    <p className="text-xl">
                      Wallet Address: {search.walletAddress}
                    </p>
                  </div>
                )}

                {search === null && issueeWallet !== "" && (
                  <div className="flex gap-x-2 bg-white text-black p-2 rounded-lg items-center">
                    {" "}
                    <p className="text-lg">User Not Found</p> <CancelIcon />
                  </div>
                )}

                <p className="my-4 desktop:text-base mobile:text-sm">
                  Upload document
                </p>

                <input
                  type="file"
                  className="w-full"
                  required
                  onChange={async (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files != null) {
                      setFile(files);
                    }
                  }}
                />
                <div className="my-4">
                  <span className="my-4 desktop:text-base mobile:text-sm">
                    Issue as Private Document?
                  </span>

                  <input
                    className="checkbox checkbox-primary ml-4"
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>

                <div className="form-control w-full max-w-xs mt-4">
                  <label className="label">
                    <span className="label-text text-white">Document Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type name here..."
                    className="input input-bordered w-full max-w-xs text-white bg-transparent border-white"
                    onChange={(e) =>
                      setFileName((e.target as HTMLInputElement).value)
                    }
                    required
                  />
                </div>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text text-white">
                      Document Description
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24 text-white bg-transparent border-white"
                    placeholder="Description..."
                    onChange={(e) =>
                      setFileDesc((e.target as HTMLTextAreaElement).value)
                    }
                    required
                  ></textarea>
                </div>
                <div className="pt-8">
                  <button
                    className="bg-[#7000FF] text-white py-2 px-8 rounded-2xl desktop:text-lg mobile:text-sm"
                    type="submit"
                  >
                    Issue
                  </button>
                </div>
                {generateLink && (
                  <div className="mt-3">
                    You can view the issued document at:{" "}
                    <Link href={newLink}>{newLink}</Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Issue;
