import Image from "next/image";
import bgimage from "../assets/bg-main-page.png";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Plan from "../components/Plan/Plan";
import Buy from "../components/Buy/Buy";
import Guide from "../components/Guide/Guide";
export default function Home() {
  return (
    <div className="bgclass ">
      <div className="desktop:absolute desktop:top-0 desktop:w-[100%] laptop:absolute laptop:top-0 laptop:w-[100%] tablet:absolute tablet:top-0 tablet:w-[100%]">
        <Navbar />
      </div>
      <Banner />
      <Guide />
      <Plan />
      <h1 className="text-6xl bannerHeading text-center">Buy Nox Tokens</h1>
      <Buy />
      <Footer />
    </div>
  );
}
