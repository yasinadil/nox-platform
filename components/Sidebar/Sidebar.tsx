import Link from "next/link";

function Sidebar() {
  return (
    <div className="bg-[#120F22] grid grid-cols-5 gap-4 h-screen">
      <div className="text-center">
        <div className="py-16">
          <Link className="title desktop:text-4xl mobile:text-3xl" href="/">
            Nox
          </Link>
        </div>
      </div>

      <div className="col-span-4">07</div>
    </div>
  );
}
export default Sidebar;
