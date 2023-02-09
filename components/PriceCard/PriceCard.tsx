function PriceCard(props) {
  return (
    <div className="bg-[#FF7A01] rounded-2xl desktop:mx-5 laptop:mx-2 tablet:mx-48 mobile:mx-12 desktop:my-0 mobile:my-8 text-center">
      <h1 className="py-8 text-3xl text-black font-bold">{props.name} </h1>
      <p className="desktop:py-6 mobile:py-4 glassEffect text-xl font-semibold">
        {" "}
        {props.price}{" "}
      </p>
      <div className="text-left desktop:px-6 laptop:px-3 mobile:px-6 desktop:text-lg laptop:text-base mobile:text-base desktop:py-3 laptop:py-10 mobile:py-0 tablet:py-16">
        <li className="desktop:p-8 laptop:p-2 mobile:p-4"> {props.desc}</li>
      </div>
    </div>
  );
}

export default PriceCard;
