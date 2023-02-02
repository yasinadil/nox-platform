import arrow from "../../assets/arrow.png";
import Image from "next/image";

function Buy() {
  return (
    <div className="pt-48 pb-24 flex justify-center">
      <div className="bg-[#1F1C32] border-4 border-[#8E00FE] desktop:px-24 mobile:px-0 desktop:py-24 mobile:py-16 rounded-3xl">
        <p className="text-center pb-8 font-semibold text-2xl">
          Buy Nox Tokens
        </p>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Enter amount</span>
          </label>
          <label className="input-group">
            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
            />
            <span className="text-gray-700">MATIC</span>
          </label>
        </div>
        <div className="flex justify-center pt-8 pb-4">
          <Image
            className=""
            style={{ width: "4vh" }}
            src={arrow}
            alt="polygon"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-white">Enter amount</span>
          </label>
          <label className="input-group">
            <input
              type="text"
              placeholder="0.01"
              className="input input-bordered"
            />
            <span className="text-gray-700">&nbsp; NOX &nbsp;</span>
          </label>
        </div>
        <div className="flex justify-center mt-8">
          <button className="px-16 py-3 bg-white text-black rounded-xl text-center">
            {" "}
            Buy{" "}
          </button>
        </div>
        <div className="pt-8">
          <div>
            <span>Slippage tolerance </span>
            <span className="float-right">0.001 </span>
          </div>
          <div>
            <span>Slippage tolerance </span>
            <span className="float-right">0.001 </span>
          </div>
          <div>
            <span>Slippage tolerance </span>
            <span className="float-right">0.001 </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buy;
