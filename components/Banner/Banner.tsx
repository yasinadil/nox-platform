import Image from "next/image";
import polygon from "../../assets/ethereum-eth-logo.png";
import guide from "../../assets/guide.png";
import Navbar from "../Navbar/Navbar";

function Banner() {
  return (
    <div className="hero min-h-screen bg-transparent">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center">
          <div className="grid grid-cols-2 gap-4 hide-mobile desktop:mx-24 desktop:my-12 laptop:mx-24 laptop:my-12 tablet:mx-24 tablet:my-4">
            <div className="my-auto mx-auto">
              <p className="desktop:text-5xl tablet:text-3xl mobile:text-xl bannerHeading font-bold text-left">
                Easy and secure issuance and verification of documents on the
                Ethereum Blockchain.
              </p>
            </div>
            <div className="mx-auto my-auto">
              <div className="mockup-phone spin-image">
                <div className="camera "></div>
                <div className="display">
                  <div className="artboard artboard-demo phone-1 bg-gray-800">
                    <Image
                      className="spinning"
                      style={{ width: "12vh" }}
                      src={polygon}
                      alt="polygon"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hide-laptop">
            <p className="desktop:text-3xl mobile:text-xl bannerHeading pb-4 hide-laptop">
              Easy and secure issuance and verification of documents on the
              Ethereum Blockchain.
            </p>
            <button className="hide-laptop btn btn-outline text-white">
              Launch DApp
            </button>
            <div className="mockup-phone spin-image">
              <div className="camera "></div>
              <div className="display">
                <div className="artboard artboard-demo phone-1 bg-gray-800">
                  <Image
                    className="spinning"
                    style={{ width: "12vh" }}
                    src={polygon}
                    alt="polygon"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;

<div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md"></div>
  </div>
</div>;
