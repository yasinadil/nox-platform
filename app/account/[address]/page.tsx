"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { noxNFTAddress, noxPlatform } from "../../../Config";
import { ethers, BigNumber } from "ethers";
import { useAccount } from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";
import avatar from "../../../assets/avatar.png";
import degree from "../../../assets/degree.png";
import placeholderImg from "../../../assets/img-placeholder.png";

const noxSbtABI = require("/components/ABI/noxSbtABI.json");
const noxPlatformABI = require("/components/ABI/noxPlatformABI.json");

function Account({ params }: any) {
  const [tokensOwned, setTokensOwned] = useState<number[]>([]);
  const [tokens, setTokens] = useState("");
  const [nfts, setNfts] = useState<object[]>([]);
  const [loading, isLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const w_address = params.address;
  console.log(w_address);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      setNfts([]);
    }
    if (isConnected && address) {
      setWalletAddress(address);
    }
    if (w_address != undefined) {
      loadNftData();
    }
  }, [w_address, isConnected, address]);

  async function loadNftData() {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_AlchemyAPI}`
    );
    const sbtContract = new ethers.Contract(noxNFTAddress, noxSbtABI, provider);
    const owned: number[] = await sbtContract.walletOfOwner(w_address);
    setTokensOwned(owned);
    if (owned.length == 0) {
      setTokens("0");
    }
    for (let i = 0; i < owned.length; i++) {
      let url = await sbtContract.tokenURI(Number(owned[i]));
      console.log(url);

      if (url.startsWith("ipfs://")) {
        url = `https://w3s.link/ipfs/${url.split("ipfs://")[1]}`;

        const TokenMetadata = await fetch(url).then((response) =>
          response.json()
        );
        let TokenImage = TokenMetadata.image;
        let TokenName = TokenMetadata.name;
        if (TokenImage.startsWith("ipfs://")) {
          TokenImage = `https://w3s.link/ipfs/${
            TokenImage.split("ipfs://")[1]
          }`;
        }
        setNfts((nfts) => [...nfts, { name: TokenName, img: TokenImage }]);
      } else if (url === "Private") {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_AlchemyAPI}`
        );

        const platformContract = new ethers.Contract(
          noxPlatform,
          noxPlatformABI,
          provider
        );
        const encrypted = await platformContract.encryptedUrls(
          Number(owned[i]),
          address
        );

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
          .then(async (decryptedMessage) => {
            console.log("The decrypted message is:", decryptedMessage.message);
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

            setNfts((nfts) => [
              ...nfts,
              {
                name: TokenName,
                img: TokenImage,
                description: TokenDescription,
                issuer: TokenIssuer,
                issuee: TokenIssuee,
                date: tokendate.toLocaleDateString("en-GB"),
              },
            ]);
          })
          .catch((e) => console.log(e));

        // setNfts((nfts) => [
        //   ...nfts,
        //   {
        //     name: "Private",
        //     img: "https://w3s.link/ipfs/bafkreicforix5h2z4r5hgzwuglo5nuc5q6fixr43ijmv2oav4m72g77dry/",
        //   },
        // ]);
      }
    }
    isLoading(false);
  }

  return (
    <div className="bg-[#120F22]">
      <Navbar />
      <div className="desktop:mx-12 laptop:mx-12 tablet:mx-12 mobile:mx-2 py-20">
        <div className="avatar ml-6">
          <div className="w-24 rounded-full">
            <Image src={avatar} alt="avatar" />
          </div>
        </div>
        <p className="text-xl ml-6">Unnamed </p>
        <Link
          href={`https://https://mumbai.polygonscan.com/address/${w_address}`}
          className="ml-6 link link-info text-white"
        >
          {" "}
          {w_address != undefined ? truncateEthAddress(w_address) : null}
        </Link>
        <p className="text-center text-4xl bannerHeading desktop:pt-36 laptop:pt-24 tablet:pt-20 mobile:pt-12">
          My Documents{" "}
        </p>
        <div className="desktop:mx-6 laptop:mx-6 tablet:mx-6 mobile:mx-0 mt-12">
          <div className="desktop:grid desktop:grid-cols-6 laptop:grid laptop:grid-cols-4 mobile:grid mobile:grid-cols-1 tablet:flex tablet:flex-grow tablet:flex-wrap tablet:gap-x-4 tablet:gap-y-8 mobile:gap-x-4 mobile:gap-y-8">
            {loading && (
              <div className="animate-pulse flex space-x-4 mx-auto my-auto">
                <div className="rounded-full bg-slate-700 h-80 w-80"></div>
              </div>
            )}
            {nfts.length == 0 && !loading && (
              <div className="w-80 h-80 place-content-center col-span-6">
                <Image src={placeholderImg} alt="placeholder" />
                <p className="text-center pt-4">No Document Owned</p>
              </div>
            )}
            {nfts.length > 0 && (
              <>
                {nfts.map((data: any, index) => {
                  return (
                    <div
                      key={index}
                      className="glass desktop:w-[100%] desktop:h-[100%] laptop:w-[80%] laptop:h-[100%] mobile:w-[80%] mobile:h-[100%] tablet:w-[40%] tablet:h-[100%] mx-auto my-auto cursor-pointer"
                    >
                      <Link href={`/token/${tokensOwned[index]}`}>
                        <img
                          className="desktop:w-[30vw] desktop:h-[20vh] laptop:w-[100%] laptop:h-[80%] tablet:w-[100%] tablet:h-[15vw] mobile:w-[100%] mobile:h-[80%]"
                          src={data.img}
                          alt="avatar"
                        />
                        <p className="my-4 text-center">{data.name} </p>
                      </Link>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Account;
