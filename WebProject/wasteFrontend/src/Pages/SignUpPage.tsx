import Login from "@/SignUpLogin/Login";
import SignUp from "@/SignUpLogin/SignUp";
import { Divider } from "@mantine/core";
import { IconAnchor } from "@tabler/icons-react";
import { Leaf } from "lucide-react";

import { useLocation } from "react-router-dom";


const SignUpPage = () => {
    const location=useLocation()
    return(
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] overflow-hidden">
            
            <div className={`w-[100vw] h-[100vh] flex [&>*]:flex-shrink-0 transition-all ease-in-out duration-1000 ${location.pathname=='/signup'?'-translate-x-1/2':'translate-x-0'}`}>
                <Login />
                <div className={`w-1/2 h-full transition-all ease-in-out duration-1000 ${location.pathname=='/signup'?'rounded-r-[300px]':'rounded-l-[300px]'} bg-mine-shaft-900 flex items-center justify-center flex-col gap-5`}>
                <div className='flex items-center text-green-400'>
                    <Leaf className=" sroke={2.5} w-1/3" height={100}/>
                    <div className="text-6xl font-bold leading-tight text-mine-shaft-100 [&>span]:text-green-500">Smart <span>Waste</span> <span>Management</span> App</div>
                </div>
                    {/* <div className="text-2xl text-mine-shaft-200 text-center font-semibold">Earn reward for you!!!</div> */}
                </div>
                <SignUp/>
            </div>
            
        </div>
    )
}

export default SignUpPage;  