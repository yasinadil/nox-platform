import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Banner from "../components/Banner/Banner";
import Plan from "../components/Plan/Plan";
import Buy from "../components/Buy/Buy";
import Guide from "../components/Guide/Guide";

export default function Home() {
  return (
    <div className="bgclass">
      <Navbar />
      <Banner />
      <Guide />
      <Plan />
      <div className="py-36">
        <h1 className="desktop:text-6xl mobile:text-3xl bannerHeading text-center pb-6">
          Buy Nox Tokens
        </h1>
        <Buy />
      </div>
      <Footer />
    </div>
  );
}
