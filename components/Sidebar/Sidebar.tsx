import Link from "next/link";

function Sidebar() {
  return (
    <div className="bg-[#120F22] grid grid-cols-5 gap-4 h-screen">
      <div className="text-center border-r-2 border-[#7000FF]">
        <div className="py-16">
          <Link className="title desktop:text-4xl mobile:text-3xl" href="/">
            Nox
          </Link>
          <div className="bg-class w-full">
            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
            <ul className="menu w-full  text-cyan-100  pt-64 text-center">
              <li className="border-t-2 border-[#7000FF]">
                <a className="flex justify-center">Token Swap</a>
              </li>
              <li className="border-t-2 border-[#7000FF]">
                <a className="flex justify-center">Publishing</a>
              </li>
              <li className="border-t-2 border-b-2 border-[#7000FF]">
                <a className="flex justify-center">Verification</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="col-span-4 ">
        <div className="hero min-h-screen ">
          <div className="hero-content flex-col lg:flex-row-reverse pl-32 bg-[#181527] ">
            <div>
              <p className="text text-right">Your Wallet address</p>
              <div className="inline-block p-2 bg-white rounded shadow"></div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
