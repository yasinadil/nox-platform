import Image from "next/image";
import polygon from "../../assets/polygon.png";
import guide from "../../assets/guide.png";

function Banner() {
  return (

    <div className="hero min-h-screen bg-transparent">
    <div className="hero-content flex-col lg:flex-row">
    <div className="text-center">
        <p className="desktop:text-3xl mobile:text-xl bannerHeading pb-4">
          Easy and secure issuance and verification of documents on the Polygon
          Blockchain
        </p>
        <button className="desktop:hidden mobile:visible btn btn-outline text-white">
          Launch DApp
        </button>
        <div className="py-5 flex justify-center align-middle">
          <Image
            className=""
            style={{ width: "8vh" }}
            src={polygon}
            alt="polygon"
          />
        </div>
        <div className="desktop:py-24 mobile:py-24 text-center">
          <p className="desktop:text-2xl mobile:text-xl font-semibold pb-4">
            Visit our guide series to learn how to use the DApp
          </p>
          <Image
            className="inline"
            style={{width:"80vh"}}
            src={guide}
            alt="guide"
          />
        </div>
      </div>
      
    </div>
  </div>
  );
}

export default Banner;
