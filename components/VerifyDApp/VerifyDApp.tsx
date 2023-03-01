import Image from "next/image";
import twitter from "../../assets/twitter.png";
import facebook from "../../assets/facebook.png";
import discord from "../../assets/discord.png";
import etherscan from "../../assets/etherscan.png";

function VerifyDApp() {

  return (
    <div className="desktop:col-span-4 mobile:col-span-4 desktop:mx-auto desktop:my-auto mobile:mx-auto mobile:mt-24 desktop:w-3/4 mobile:w-full">
      <h1 className="text-center pb-6 desktop:text-2xl mobile:text-base">
        Verification Portal
      </h1>

      <form className="">
        <div className="desktop:px-12 mobile:px-3 pt-6 pb-10 bg-[#181527] desktop:mx-0 mobile:mx-6">
          <div className="flex flex-col md:flex-row md:items-center mb-6">
            <p className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Carlton Hooks (0xAQfj3eeF1cxx437qrACzDf351Qe) has requested for
              you to approve verification of the following document
            </p>
          </div>
          <div className="flex flex-col mb-6">
            <p className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Date Issued: 28/04/22
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <p className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Issued by: YOU
            </p>
          </div>

          <div className="flex flex-col mb-6">
            <p className="desktop:text-lg mobile:text-sm font-medium mb-2 md:mb-0 md:mr-6">
              Issued to: 0xAQfj3eeF1cxx437qrACzDf351Qe
            </p>
          </div>

          <button className="bg-[#7000FF] text-white py-2 px-8 rounded-2xl desktop:text-lg mobile:text-sm">
            View document
          </button>
          <br />

          <button className="bg-[#7000FF] text-white py-2 px-8 mt-6 rounded-2xl desktop:text-lg mobile:text-sm">
            Verify
          </button>
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
export default VerifyDApp;