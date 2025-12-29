import { Avatar } from "@mantine/core";
import { work } from "../Data/Data";
const Working=()=>{
    return <div className="mt-20 pb-5">
        <div className="text-4xl text-center font-semibold mb-3 text-mine-shaft-100">How it <span className="text-green-400">Works</span></div>

        <div className="text-lg mb-10 mx-auto text-mine-shaft-300 text-center w-1/2">Easy earn rewards and more cleaner environment.</div>
        <div className="flex px-16 justify-around items-center">
            <div className="relative">
                <img className="w-[30rem] " src="/Working/green.png" alt="girl" />
                <div className="w-[12rem] h-[10rem] flex top-[-5%] right-[5rem] absolute flex-col justify-between items-center gap-1 border border-green-400 rounded-xl py-3 px-1 backdrop-blur-md">
                    <Avatar className="!h-16 !w-16" src="avatar1.png" alt="it's me" />
                    <div className="text-sm font-semibold text-mine-shaft-200 text-center">Join with Our Community</div>
                    <div className="text-xs text-mine-shaft-300">Earn Your Rewards</div>
                </div>
            </div>
            <div className="flex flex-col gap-10">
                {work.map((item,index)=><div key={index} className="flex items-center gap-4">
                    <div className="p-2.5 bg-green-50 rounded-full">
                        <item.img width={50} height={50} className="text-green-500"/>
                    </div>
                    <div>
                        <div className="text-mine-shaft-200 text-xl font-semibold">{item.name}</div>
                        <div className="text-mine-shaft-300">{item.desc}</div>
                    </div>
                </div>)}    
            </div>    
        </div> 
    </div>
}
export default Working;