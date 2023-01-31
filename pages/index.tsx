import Image from "next/image";
import bgimage from "../assets/bg-main-page.png";
import Navbar from "../components/Navbar/Navbar.tsx"
export default function Home() {
  return (
    <div className="bg-[url('../assets/bg-main-page.png')] h-[100%] bg-cover bg-no-repeat">
      <Navbar />
      <p className="desktop:text-red-700 laptop:text-red-700 mobile:text-white"> dffd</p>
    </div>
  );
}
