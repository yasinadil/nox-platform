import Image from "next/image";
import bgimage from "../assets/bg-main-page.png";
import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import Plan from "../components/Plan/Plan";
import Buy from "../components/Buy/Buy";
export default function Home() {
  return (
    <div className="bgclass ">
      <Navbar />
      <Banner />
      <Plan />
      <Buy />
    </div>
  );
}
