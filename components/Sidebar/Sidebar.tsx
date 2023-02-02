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

      <div className="col-span-4">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              src="/images/stock/photo-1635805737707-575885ab0820.jpg"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">Box Office News!</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
