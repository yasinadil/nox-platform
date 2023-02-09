import Image from "next/image";
import free from "../../assets/free.png";
import academic from "../../assets/academic.png";
import institutional from "../../assets/institutional.png";
import PriceCard from "../PriceCard/PriceCard";

const priceData = require("../data/priceData.json");

function Plan() {
  return (
    //   <div className="hero min-h-screen">
    //     <h1 className="text-5xl font-bold">Price Plan</h1>
    //     <div className="flex">
    //       {priceData.map((data: any, index) => {
    //         return (
    //           <div key={index} className="">
    //             <div className="">
    //               <PriceCard
    //                 name={data.name}
    //                 price={data.price}
    //                 desc={data.desc}
    //               />
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>
    // );
    <div className="hero min-h-screen">
      <div className="">
        <h1 className="text-5xl text-center bannerHeading pb-6">Price Plan</h1>
        <div className="flex desktop:flex-row laptop:flex-row tablet:flex-col mobile:flex-col">
          {priceData.map((data: any, index) => {
            return (
              <div key={index} className="">
                <div className="">
                  <PriceCard
                    name={data.name}
                    price={data.price}
                    desc={data.desc}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Plan;
