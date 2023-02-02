import Image from "next/image";
import free from "../../assets/free.png";
import academic from "../../assets/academic.png";
import institutional from "../../assets/institutional.png";

function Plan() {
  return (
    <div className="text-center pb-16">
      <p className="text-4xl pb-16"> Price Plan </p>
      <div class="grid gap-x-2 gap-y-4 desktop:grid-cols-5 laptop:grid-cols-5 mobile:grid-cols-1">
        <div></div>
        <Image
          className="inline mx-auto my-auto"
          style={{ width: "25vh" }}
          src={free}
          alt="free"
        />
        <Image
          className="inline mx-auto my-auto"
          style={{ width: "25vh" }}
          src={academic}
          alt="academic"
        />
        <Image
          className="inline mx-auto my-auto"
          style={{ width: "25vh" }}
          src={institutional}
          alt="intitutional"
        />
        <div> </div>
      </div>
    </div>
  );
}

export default Plan;
