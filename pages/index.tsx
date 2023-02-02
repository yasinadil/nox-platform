import Image from "next/image";
import bgimage from "../assets/bg-main-page.png";
import Navbar from "../components/Navbar/Navbar.tsx";
import Banner from "../components/Banner/Banner.tsx";
import Plan from "../components/Plan/Plan.tsx";
export default function Home() {
  return (
    <div className="bgclass ">
      <Navbar />
      <Banner />
      <Plan />
    </div>
  );
}
