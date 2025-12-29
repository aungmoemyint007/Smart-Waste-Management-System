
import { Leaf, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DreamJob=()=>{
    const navigate = useNavigate()
    return(
    <div className="flex items-center justify-around  pt-11">
        <div className="w-[45%] flex flex-col  gap-3">
            <div className="text-7xl font-bold leading-tight text-mine-shaft-100 [&>span]:text-green-500">Smart <span>Waste</span> <span>Management</span> App</div>
            <div className="text-lg text-mine-shaft-200">Join our community in making waste management more efficient and rewarding!</div>
            <Button onClick={()=>navigate("/report")} className="bg-green-600 w-[30%] mt-10 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
                Report Waste
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
        </div>
        <div className="flex items-center justify-center">
            <div className="relative w-60 h-60 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full bg-green-600 opacity-20 animate-pulse"></div>
                <div className="absolute inset-2 rounded-full bg-green-500 opacity-40 animate-ping"></div>
                <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
                <div className="absolute inset-6 rounded-full bg-green-50 opacity-10 "></div>
                <Leaf className="absolute inset-0 m-auto h-20 w-20 text-green-600 animate-pulse" />
                
            </div>
        </div>
    </div>
    )
}
export default DreamJob;