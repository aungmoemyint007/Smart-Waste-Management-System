import { IconAnchor, IconBrandFacebook, IconBrandInstagram, IconBrandX } from "@tabler/icons-react";
import { footerLinks } from "../Data/Data";
import { Leaf } from "lucide-react";
import { useLocation } from "react-router-dom";

const Footer=()=>{
    const location = useLocation();

    return location.pathname=="/"  ?<div className="pt-20 pb-5  bottom-0 flex  gap-5 justify-around bg-mine-shaft-950 font-['poppins']">
        <div className="w-1/4 flex flex-col gap-4">
        <div className="flex gap-1 items-center text-green-500">
                <Leaf width={25} height={25}/>
                <div className="text-xl font-semibold">SWMA</div>
            </div>
            <div className="text-sm text-mine-shaft-300">Join our community in making waste management more efficient and rewarding!</div>
            <div className="flex gap-3 text-green-500 [&>div]:bg-mine-shaft-900 [&>div]:p-2 [&>div]:rounded-full [&>div]:cursor-pointer hover:[&>div]:bg-mine-shaft-700">
                <div><IconBrandFacebook/></div>
                <div><IconBrandInstagram/></div>
                <div><IconBrandX/></div>
            </div>
        </div>
        {
            footerLinks.map((item , index)=> <div key={index}>
                <div className="text-lg font-semibold mb-4 text-green-500">{item.title}</div>
                {
                    item.links.map((link, index)=><div key={index} className="text-mine-shaft-300 text-sm hover:text-green-500 cursor-pointer mb-1 hover:translate-x-2 transition duration ease-in-out">{link}</div>)
                }
            </div>)
        }
    </div>:<></>
}
export default Footer;