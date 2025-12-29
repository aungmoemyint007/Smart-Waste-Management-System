import { Link, useLocation, useNavigate } from "react-router-dom";
import { Notebook, Trash, Coins, Medal, LogOut, Home, FileQuestion } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const NavLinks = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  

  const links = [
    { name: "Home", url: "/", icon: Home },
    { name: "Report", url: "/report", icon: Notebook },
    { name: "Ask Ai", url: "/ai-chat", icon: FileQuestion },
    { name: "Collect", url: "/collect", icon: Trash },
    { name: "Exchange", url: "/exchange", icon: Coins },
    { name: "Leaderboard", url: "/leaderboard", icon: Medal },
    
  ];

  return (
    <div className="flex gap-8 text-mine-shaft-300 h-full items-center">
      {links.map((link, index) => (
        <div
          key={index}
          className={`${
            location.pathname === link.url ? "border-green-500 text-green-500" : "border-transparent"
          } border-b-[3px] h-full flex items-center`}
        >
          <Link to={link.url} className="flex gap-1 items-center">
            <span className="text-[17px]">{link.name}</span>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
