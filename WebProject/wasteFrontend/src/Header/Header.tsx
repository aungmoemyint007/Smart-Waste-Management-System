import { Avatar, Button, Indicator } from "@mantine/core";
import { IconBell } from '@tabler/icons-react';
import { IconSettings } from '@tabler/icons-react';
import { Coins } from "lucide-react";
import NavLinks from "./NavLinks";
import { Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePoints } from "@/context/PointsContext";
import NotiMenu from "./NotiMenu";
import { useSelector } from "react-redux";
import { getPoints } from "@/Services/PointService";

const Header = () => {
  const location = useLocation();
  const { points, setPoints } = usePoints();
  
  const user = useSelector((state:any)=>state.user);
  const token = useSelector((state:any)=>state.jwt);

  useEffect(() => {
    if(location.pathname !== "/signup" && location.pathname !== "/login" && user){
      getPoints().then((res:any)=>{
        setPoints(Number(res.points));
      }).catch((err:any)=>{
        console.log(err);
      });
    }
}, [location, user?.id]);

console.log(points)



  return location.pathname !== '/signup' && location.pathname !== '/login' ? (
    <div className="w-full px-6 text-white h-20 flex justify-between items-center font-['poppins']">
      <div className="flex gap-1 items-center text-green-500">
        <Leaf width={30} height={30} />
        <div className="text-3xl font-semibold">SWMA</div>
      </div>
      <NavLinks />
      <div className="flex gap-3 items-center">
        <div className="mr-2 md:mr-4 flex items-center bg-mine-shaft-900 rounded-full px-2 md:px-3 py-1">
          <Coins className="h-4 w-4 md:h-5 md:w-5 mr-3 text-green-500" />
          <span className="font-semibold text-sm md:text-base">{points}</span>
        </div>
        {user ? (
          <ProfileMenu />
        ) : (
          <Link to="/login"><Button variant="subtle" color="#05f714">Login</Button></Link>
        )}
        {user ? <NotiMenu /> : null}
      </div>
    </div>
  ) : null;
};

export default Header;