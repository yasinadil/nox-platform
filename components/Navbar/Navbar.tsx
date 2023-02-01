import Link from "next/link";

function Navbar() {
  return (
    <div className="navbar bg-transparent desktop:py-8 desktop:px-8 mobile:py-8 mobile:px-2">
      <div className="flex-1">
        <Link href="/" className="title desktop:text-4xl mobile:text-3xl">
          Nox
        </Link>
      </div>
      <div className="flex-none gap-2">
        <button className="desktop:visible mobile:invisible desktop:pr-6 mobile:pr-0">
          Launch DApp
        </button>
        <button
          className="bg-[#FF7A00] px-2 py-1 mobile:text-base"
          style={{ borderRadius: "20px" }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}

export default Navbar;
