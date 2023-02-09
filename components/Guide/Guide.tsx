import Image from "next/image";
import guide from "../../assets/guide.png";

function Guide() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="">
          <Image
            className="inline"
            style={{ width: "140vh" }}
            src={guide}
            priority={true}
            alt="guide"
          />
        </div>
      </div>
    </div>
  );
}

export default Guide;
