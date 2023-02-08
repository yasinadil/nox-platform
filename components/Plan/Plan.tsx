import Image from "next/image";
import free from "../../assets/free.png";
import academic from "../../assets/academic.png";
import institutional from "../../assets/institutional.png";
import PriceCard from "../PriceCard/PriceCard";

function Plan() {
  return (
    // <div className="text-center desktop:h-screen laptop:h-screen">
    //   <p className="text-4xl py-32"> Price Plan </p>
    //   <div className="grid gap-x-2 gap-y-4 desktop:grid-cols-8 laptop:grid-cols-5 mobile:grid-cols-1 py-44">
    //     <div className="desktop:col-start-2 desktop:col-end-4 laptop:col-start-2 laptop:col-end-3">
    //       <PriceCard />
    //     </div>
    //     <div className="desktop:col-start-4 desktop:col-end-6 laptop:col-start-3 laptop:col-end-4">
    //       <PriceCard />
    //     </div>
    //     <div className="desktop:col-start-6 desktop:col-end-8 laptop:col-start-4 laptop:col-end-5">
    //       <PriceCard />
    //     </div>
    //   </div>
    // </div>
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="">
          <p className="text-6xl bannerHeading"> Price Plan </p>
          <div className="grid gap-x-2 gap-y-4 desktop:grid-cols-8 laptop:grid-cols-5 mobile:grid-cols-1 desktop:pb-0 laptop:pb-0 mobile:pb-20 tablet:pb-20">
            <div className="desktop:col-start-2 desktop:col-end-4 laptop:col-start-2 laptop:col-end-3">
              <PriceCard />
            </div>
            <div className="desktop:col-start-4 desktop:col-end-6 laptop:col-start-3 laptop:col-end-4">
              <PriceCard />
            </div>
            <div className="desktop:col-start-6 desktop:col-end-8 laptop:col-start-4 laptop:col-end-5">
              <PriceCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Plan;
