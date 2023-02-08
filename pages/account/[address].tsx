import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { noxNFTAddress } from "../../Config";
import { ethers, BigNumber } from "ethers";
import { useAccount } from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";
import avatar from "../../assets/avatar.png";
import degree from "../../assets/degree.png";

const noxSbtABI = require("../../components/ABI/noxSbtABI.json");

function Account() {
  const [tokensOwned, setTokensOwned] = useState([]);
  const [tokens, setTokens] = useState("");
  const [nfts, setNfts] = useState([]);
  const [loading, isLoading] = useState(true);
  const router = useRouter();
  const w_address = router.query;
  let walletAddress = w_address.address;
  console.log(walletAddress);

  useEffect(() => {
    if (walletAddress != undefined) {
      async function loadNftData() {
        const provider = new ethers.providers.JsonRpcProvider(
          `https://eth-goerli.g.alchemy.com/v2/${process.env.alchemyAPI}`
        );
        const sbtContract = new ethers.Contract(
          noxNFTAddress,
          noxSbtABI,
          provider
        );
        const owned: number[] = await sbtContract.walletOfOwner(walletAddress);
        setTokensOwned(owned);
        console.log(owned);
        if (owned.length == 0) {
          setTokens("0");
        }
        for (let i = 0; i < owned.length; i++) {
          let url = await sbtContract.tokenURI(Number(owned[i]));
          console.log(url);

          if (url.startsWith("ipfs://")) {
            url = `https://w3s.link/ipfs/${url.split("ipfs://")[1]}`;
          }
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
        }
        isLoading(false);
      }
      loadNftData();
    }
  }, [walletAddress]);

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
          href={`https://goerli.etherscan.io/address/${walletAddress}`}
          className="ml-6 link link-info text-white"
        >
          {" "}
          {walletAddress != undefined
            ? truncateEthAddress(walletAddress)
            : null}
        </Link>
        <p className="text-center text-4xl bannerHeading desktop:pt-36 laptop:pt-24 tablet:pt-20 mobile:pt-12">
          My Documents{" "}
        </p>
        <div className="desktop:mx-6 laptop:mx-6 tablet:mx-6 mobile:mx-0 mt-12">
          {loading && (
            <div className="desktop:grid desktop:grid-cols-6 laptop:grid laptop:grid-cols-4 mobile:grid mobile:grid-cols-1 tablet:flex tablet:flex-grow tablet:flex-wrap tablet:gap-x-4 tablet:gap-y-8 mobile:gap-x-4 mobile:gap-y-8">
              <div className="animate-pulse flex space-x-4 mx-auto my-auto">
                <div className="rounded-full bg-slate-700 h-80 w-80"></div>
              </div>
            </div>
          )}
          {nfts.length == 0 && !loading && (
            <div className="flex justify-center">
              <div className="w-80 h-80 place-content-center">
                <p className="text-center">No NFT Owned</p>
              </div>
            </div>
          )}
          {nfts.length > 0 && (
            <div className="desktop:grid desktop:grid-cols-6 laptop:grid laptop:grid-cols-4 mobile:grid mobile:grid-cols-2 tablet:flex tablet:flex-grow tablet:flex-wrap tablet:gap-x-4 tablet:gap-y-8 mobile:gap-x-4 mobile:gap-y-8">
              {nfts.map((data, index) => {
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
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Account;
