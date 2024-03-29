"use client";
import { useState, useEffect } from "react";
import { noxNFTAddress, noxPlatform } from "../../../Config";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import placeholderImg from "/assets/img-placeholder.png";
import share from "/assets/share.png";
import Image from "next/image";
import truncateEthAddress from "truncate-eth-address";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import EthCrypto from "eth-crypto";

const noxSbtABI = require("/components/ABI/noxSbtABI.json");
const noxPlatformABI = require("/components/ABI/noxPlatformABI.json");

interface User {
  name: string;
  walletAddress: string;
  internalWalletAddress: string;
  publicKey: string;
}

function NFTPage({ params }: any) {
  const [NFT, setNFT] = useState({
    name: "",
    img: "",
    description: "",
    issuer: "",
    issuee: "",
    date: "",
  });
  const [instituteName, setInstituteName] = useState("");
  const [instituteWalletAddress, setInstituteWalletAddress] = useState("");
  const [authenticationStatus, setAuthenticationStatus] = useState("");
  const [authenticating, isAuthenticating] = useState(false);
  const [issuerName, setIssuerName] = useState("");
  const [issueeName, setIssueeName] = useState("");
  const [giveAccessWallet, setGiveAccessWallet] = useState("");
  const [urlAccess, setURLAccess] = useState("");
  const [search, setSearch] = useState<User | null>(null);

  const tokenId = params.id;
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (tokenId != undefined) {
      loadNftData();
    }
  }, [tokenId]);

  const getIssuerName = async (searchWallet) => {
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
          setIssuerName("");
        } else {
          setIssuerName(data.message.name);
        }
      });
  };

  const getIssueeName = async (searchWallet) => {
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
          setIssueeName("");
        } else {
          setIssueeName(data.message.name);
        }
      });
  };

  async function loadNftData() {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_AlchemyAPI}`
    );
    const sbtContract = new ethers.Contract(noxNFTAddress, noxSbtABI, provider);
    let url = await sbtContract.tokenURI(Number(tokenId));

    if (url === "Private") {
      const platformContract = new ethers.Contract(
        noxPlatform,
        noxPlatformABI,
        provider
      );
      const encrypted = await platformContract.encryptedUrls(tokenId, address);
      const headers = {
        "Content-Type": "application/json",
      };
      fetch("/api/decryptURL", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          walletAddress: address,
          encryptedURL: encrypted,
        }),
      })
        .then((response) => response.json())
        .then(async (decryptedMessage) =>
          // console.log('The decrypted message is:', decryptedMessage)
          {
            console.log("The decrypted message is:", decryptedMessage);
            setURLAccess(decryptedMessage.message);
            url = `https://w3s.link/ipfs/${
              decryptedMessage.message.split("ipfs://")[1]
            }`;

            const TokenMetadata = await fetch(url).then((response) =>
              response.json()
            );

            let TokenImage = TokenMetadata.image;
            let TokenName = TokenMetadata.name;
            let TokenDescription = TokenMetadata.description;
            let TokenIssuer = TokenMetadata.issuer;
            let TokenIssuee = TokenMetadata.issuee;
            let TokenDate = Number(TokenMetadata.date);
            let tokendate = new Date(TokenDate * 1000);
            if (TokenImage.startsWith("ipfs://")) {
              TokenImage = `https://w3s.link/ipfs/${
                TokenImage.split("ipfs://")[1]
              }`;
            }
            await getIssuerName(TokenMetadata.issuer);
            await getIssueeName(TokenMetadata.issuee);
            setNFT({
              name: TokenName,
              img: TokenImage,
              description: TokenDescription,
              issuer: TokenIssuer,
              issuee: TokenIssuee,
              date: tokendate.toLocaleDateString("en-GB"),
            });
          }
        )
        .catch((error) => {
          console.log(error.message);
          setNFT({
            name: "Private",
            img: "Private",
            description: "Private",
            issuer: "Private",
            issuee: "Private",
            date: "Private",
          });
        });
    } else if (url.startsWith("ipfs://")) {
      url = `https://w3s.link/ipfs/${url.split("ipfs://")[1]}`;

      const TokenMetadata = await fetch(url).then((response) =>
        response.json()
      );

      let TokenImage = TokenMetadata.image;
      let TokenName = TokenMetadata.name;
      let TokenDescription = TokenMetadata.description;
      let TokenIssuer = TokenMetadata.issuer;
      let TokenIssuee = TokenMetadata.issuee;
      let TokenDate = Number(TokenMetadata.date);
      let tokendate = new Date(TokenDate * 1000);
      if (TokenImage.startsWith("ipfs://")) {
        TokenImage = `https://w3s.link/ipfs/${TokenImage.split("ipfs://")[1]}`;
      }
      await getIssuerName(TokenMetadata.issuer);
      await getIssueeName(TokenMetadata.issuee);

      setNFT({
        name: TokenName,
        img: TokenImage,
        description: TokenDescription,
        issuer: TokenIssuer,
        issuee: TokenIssuee,
        date: tokendate.toLocaleDateString("en-GB"),
      });
    }
  }

  const authenticate = async () => {
    isAuthenticating(true);
    const headers = {
      "Content-Type": "application/json",
    };
    fetch("/api/getUserEncKey", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        walletAddress: instituteWalletAddress,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        if (
          data.message === "User not found" ||
          data.message.name != instituteName ||
          data.message.walletAddress != NFT.issuer
        ) {
          setAuthenticationStatus("Not Authenticated");
        } else if (
          data.message.name === instituteName &&
          data.message.walletAddress === NFT.issuer
        )
          setAuthenticationStatus("Authenticated");

        isAuthenticating(false);
      })
      .catch((e) => {
        console.log(e);
        isAuthenticating(false);
      });
  };

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

  const giveAccess = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const signer = provider.getSigner();

    const platformContract = new ethers.Contract(
      noxPlatform,
      noxPlatformABI,
      signer
    );
    try {
      // const encryptedMessage = await EthCrypto.encryptWithPublicKey(
      //   search.publicKey, // encrypt
      //   urlAccess
      // );
      // console.log(JSON.stringify(encryptedMessage));

      const headers = {
        "Content-Type": "application/json",
      };
      fetch("/api/getUserEncKey", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          walletAddress: giveAccessWallet,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log(data.message);
          if (data.message === "User not found") {
            toast.error("User Not Found!", {
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
            console.log("url" + urlAccess);

            const encryptedMessage = await EthCrypto.encryptWithPublicKey(
              data.message.publicKey, // encrypt
              urlAccess
            );

            console.log(JSON.stringify(encryptedMessage));

            const tx = await platformContract.giveAccess(
              tokenId,
              giveAccessWallet,
              JSON.stringify(encryptedMessage)
            );
            await provider.waitForTransaction(tx.hash);
          }
        });
    } catch (error) {}
  };

  return (
    <div className="text-white bg-[#120F22] justify-start">
      <Navbar />
      <div className="grid desktop:grid-cols-2 laptop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-x-6 mx-8 my-16">
        <div className="desktop:w-[100%] desktop:h-[100%] laptop:w-[100%] laptop:h-[80%] tablet:w-[100%] tablet:h-[100%] mobile:w-[100%] mobile:h-[100%] p-4 bg-transparent border border-gray-700 rounded-md">
          {NFT.img === "" && (
            <Image
              className="mx-auto my-auto"
              src={placeholderImg}
              width={900}
              height={400}
              alt="avatar"
            />
          )}
          {NFT.img === "Private" && (
            <Image
              className="mx-auto my-auto"
              src={placeholderImg}
              width={900}
              height={400}
              alt="avatar"
            />
          )}
          {NFT.img.startsWith("https://w3s.link/ipfs") && (
            <Image
              className="mx-auto my-auto"
              src={NFT.img}
              width={1000}
              height={1000}
              alt="avatar"
              priority={true}
            />
          )}
        </div>
        <div className="m-6">
          <div>
            <span>#{tokenId}</span>

            <span className="float-right tooltip" data-tip="Copy link">
              {" "}
              <Image
                className="mx-auto my-auto rounded-full bg-[#3ABFF8] hover:bg-slate-600 p-1 cursor-pointer"
                src={share}
                width={40}
                height={30}
                alt="avatar"
              />
            </span>
          </div>
          <p>
            Owned by:
            {issueeName === "" ? (
              <Link className="ml-2" href={`/account/${NFT.issuee}`}>
                <span>{truncateEthAddress(NFT.issuee)}</span>
              </Link>
            ) : (
              <Link className="ml-2" href={`/account/${NFT.issuee}`}>
                <span>{issueeName}</span>
              </Link>
            )}
          </p>
          <div className="mt-8">
            <h1 className="text-2xl"> Authenticate Document </h1>
            <div className="flex flex-col mb-6">
              <label className="desktop:text-base mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
                Issuer&apos;s Name:
              </label>
              <input
                className="border border-gray-400 p-2 w-full rounded-2xl text-black"
                type="text"
                value={instituteName}
                onChange={(e) => {
                  setInstituteName(e.target.value);
                }}
                placeholder="Enter Issuer's Name"
                required
              />
            </div>
            <div>
              <div className="flex flex-col mb-6">
                <label className="desktop:text-base mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
                  Issuer&apos; Wallet Address:
                </label>
                <input
                  className="border border-gray-400 p-2 w-full rounded-2xl text-black"
                  type="text"
                  value={instituteWalletAddress}
                  onChange={(e) => {
                    setInstituteWalletAddress(e.target.value);
                  }}
                  placeholder="Enter Issuer's Wallet Address"
                  required
                />
              </div>
              <button
                onClick={() => {
                  setTimeout(async () => {
                    authenticate();
                  }, 1000);
                }}
                className="bg-blue-500 text-white px-5 py-1 rounded-xl hover:bg-blue-600"
              >
                {authenticating ? "Authenticating..." : "Authenticate"}
              </button>

              {authenticationStatus == "Authenticated" && (
                <h1 className="mt-3 ml-4 flex items-center gap-x-2 text-green-500 font-semibold">
                  {authenticationStatus}
                </h1>
              )}
              {authenticationStatus == "Not Authenticated" && (
                <h1 className="mt-3 ml-4 flex items-center gap-x-2 text-red-500 font-semibold">
                  {authenticationStatus}
                </h1>
              )}
            </div>

            {address === NFT.issuee && (
              <div>
                <div className="flex flex-col my-6">
                  <label className="desktop:text-base mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
                    Give Access
                  </label>
                  <input
                    className="border border-gray-400 p-2 w-full rounded-2xl text-black"
                    type="text"
                    value={giveAccessWallet}
                    onChange={(e) => {
                      setTimeout(async () => {
                        setSearch(null);
                        await findUserKey(e.target.value);
                      }, 1000);

                      setGiveAccessWallet(e.target.value);
                    }}
                    placeholder="Enter Wallet Address..."
                    required
                  />
                </div>
                <button
                  onClick={() => {
                    setTimeout(async () => {
                      giveAccess();
                    }, 1000);
                  }}
                  className="bg-blue-500 text-white px-5 py-1 rounded-xl hover:bg-blue-600"
                >
                  {authenticating ? "Giving Access..." : "Give Access"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid desktop:grid-cols-2 laptop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-x-6 mx-8">
        <div className="rounded-2xl">
          <div tabIndex={0} className="collapse collapse-open rounded-box">
            <div className="collapse-title text-xl font-medium bg-gray-800">
              Name
            </div>
            <div className="collapse-content py-4 bg-gray-900">
              {NFT.name != "" ? (
                <p>{NFT.name}</p>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-6 bg-slate-700 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div tabIndex={0} className="collapse collapse-open rounded-box mt-6">
            <div className="collapse-title text-xl font-medium bg-gray-800">
              Descripton
            </div>
            <div className="collapse-content py-4 bg-gray-900">
              {NFT.description != "" ? (
                <p>{NFT.description}</p>
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-6 bg-slate-700 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="desktop:mt-0 laptop:mt-0 tablet:mt-0 mobile:mt-6">
          <div tabIndex={0} className="collapse collapse-open rounded-box">
            <div className="collapse-title text-xl font-medium bg-gray-800 grid desktop:grid-cols-4 laptop:grid-cols-4 tablet:grid-cols-4 mobile:grid-cols-4">
              <p className="desktop:text-xl laptop:text-xl tablet:text-xl mobile:text-base">
                Item Activity
              </p>
              <p className="desktop:text-xl laptop:text-xl tablet:text-xl mobile:text-base">
                Issuer
              </p>
              <p className="desktop:text-xl laptop:text-xl tablet:text-xl mobile:text-base">
                Issuee
              </p>
              <p className="desktop:text-xl laptop:text-xl tablet:text-xl mobile:text-base">
                Date{" "}
              </p>
            </div>
            <div className="collapse-content py-4 grid desktop:grid-cols-4 laptop:grid-cols-4 tablet:grid-cols-4 mobile:grid-cols-4 bg-gray-900 desktop:pr-12 laptop:pr-12 tablet:pr-10">
              <p className="desktop:text-lg laptop:text-xl tablet:text-xl mobile:text-base">
                Issued
              </p>
              {NFT.issuer != "" ? (
                <p className="desktop:text-lg laptop:text-lg tablet:text-lg mobile:text-base">
                  <Link href={`/account/${NFT.issuer}`}>
                    {" "}
                    {truncateEthAddress(NFT.issuer)}
                  </Link>
                </p>
              ) : (
                <div className="animate-pulse">
                  <div className="py-1 mr-6">
                    <div className="h-6 bg-slate-700 rounded"></div>
                  </div>
                </div>
              )}
              {NFT.issuee != "" ? (
                <p className="desktop:text-lg laptop:text-lg tablet:text-lg mobile:text-base">
                  <Link href={`/account/${NFT.issuee}`}>
                    {truncateEthAddress(NFT.issuee)}
                  </Link>
                </p>
              ) : (
                <div className="animate-pulse">
                  <div className="py-1 mr-6">
                    <div className="h-6 bg-slate-700 rounded"></div>
                  </div>
                </div>
              )}
              {NFT.date != "" ? (
                <p className="desktop:text-lg laptop:text-lg tablet:text-lg mobile:text-base">
                  {NFT.date}
                </p>
              ) : (
                <div className="animate-pulse">
                  <div className="py-1 mr-6">
                    <div className="h-6 bg-slate-700 rounded"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}

export default NFTPage;
