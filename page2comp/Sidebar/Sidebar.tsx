import Link from "next/link";

function Sidebar(){
    return(
      <div className="bg-[#120F22] grid grid-cols-5 gap-4 h-screen">
      <div className="fl">
      <Link href="/" className="title desktop:text-4xl mobile:text-3xl text-center py-16 ">
          Nox
        </Link>
        <div className="drawer drawer-mobile">
  <div className="drawer-side">
    <label htmlFor="my-drawer-2" className="drawer-overlay"></label> 
    <ul className="menu p-4 w-80 bg-base-100 text-base-content">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  
  </div>
</div>
      </div>
        
      <div className="col-span-4">07</div>
    </div>
    )
}
export default Sidebar;