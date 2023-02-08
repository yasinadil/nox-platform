import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { noxNFTAddress, noxPlatform } from "../../Config";
import { ethers, BigNumber } from "ethers";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import placeholderImg from "../../assets/img-placeholder.png";
import share from "../../assets/share.png";
import Image from "next/image";
import truncateEthAddress from "truncate-eth-address";

const noxSbtABI = require("../../components/ABI/noxSbtABI.json");
const noxPlatformABI = require("../../components/ABI/noxPlatformABI.json");

function NFTPage() {
  const [NFT, setNFT] = useState({
    name: "",
    img: "",
    description: "",
    issuer: "",
    issuee: "",
    date: "",
  });

  const router = useRouter();
  const tokenId = router.query;
  console.log(tokenId.id);

  useEffect(() => {
    if (tokenId.id != undefined) {
      loadNftData();
    }
  }, [tokenId.id]);

  async function loadNftData() {
    const provider = new ethers.providers.JsonRpcProvider(
      `https://eth-goerli.g.alchemy.com/v2/${process.env.alchemyAPI}`
    );
    const sbtContract = new ethers.Contract(noxNFTAddress, noxSbtABI, provider);
    let url = await sbtContract.tokenURI(Number(tokenId.id));
    console.log(url);

    if (url.startsWith("ipfs://")) {
      url = `https://w3s.link/ipfs/${url.split("ipfs://")[1]}`;
    }
    const TokenMetadata = await fetch(url).then((response) => response.json());
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

    setNFT({
      name: TokenName,
      img: TokenImage,
      description: TokenDescription,
      issuer: TokenIssuer,
      issuee: TokenIssuee,
      date: tokendate.toLocaleDateString("en-GB"),
    });
  }
  return (
    <div className="text-white bg-[#120F22] justify-start">
      <Navbar />
      <div className="grid desktop:grid-cols-2 laptop:grid-cols-2 tablet:grid-cols-2 mobile:grid-cols-1 gap-x-6 mx-8 my-16">
        <div className="desktop:w-[100%] desktop:h-[100%] laptop:w-[100%] laptop:h-[80%] tablet:w-[100%] tablet:h-[100%] mobile:w-[100%] mobile:h-[100%] p-4 bg-transparent border border-gray-700 rounded-md">
          {NFT.img != "" ? (
            <Image
              className="mx-auto my-auto"
              src={NFT.img}
              width={1000}
              height={1000}
              alt="avatar"
              priority={true}
            />
          ) : (
            <Image
              className="mx-auto my-auto"
              src={placeholderImg}
              width={900}
              height={400}
              alt="avatar"
            />
          )}
        </div>
        <div className="m-6">
          <div>
            <span>#{tokenId.id}</span>

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
          <p>Owned by: {truncateEthAddress(NFT.issuee)}</p>
        </div>
      </div>
      {/* <div>
        <p className="m-8">Name: {NFT.name} </p>
        <p className="m-8">Description: {NFT.description} </p>
      </div> */}
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
                  {truncateEthAddress(NFT.issuer)}
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
                  {truncateEthAddress(NFT.issuee)}
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
