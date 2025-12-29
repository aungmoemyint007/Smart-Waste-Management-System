import { usePoints } from "@/context/PointsContext";
import { Button, Divider, Loader, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconCalendarMonth, IconClockHour3, IconCopy } from "@tabler/icons-react";
import axios from "axios";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Card=(props:any)=>{

    const token = localStorage.getItem('token')
    const [name,setName]=useState('')
    const [type,setType]=useState('')
    const [reqPoints,setReqPoints]=useState(0)
    const {points, setPoints} = usePoints();
    const [loading,setLoading]=useState(false)
    const [qr, setQr] = useState('')
    const [inviteLink, setInviteLink] = useState('')
    const [show, setShow] = useState(false)

    const handleRedeem = async (id: number, reqPoints: number) => {

        setLoading(true)
        if (points < reqPoints) {
            toast.error('You do not have enough points to redeem this reward');
            setLoading(false)
            return;
        }

        
            try {
                const response = await axios.post('http://localhost:8000/api/redeem', {
                    reward_id: id
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
               
                toast.success('Reward redeemed successfully')
                setPoints((prevPoints:number) => prevPoints - reqPoints);
                props.setShouldFetch(true);
                setLoading(false)
                // console.log(points-reqPoints)
            } catch (error) {
                setLoading(false)
                console.error('Error redeeming reward:', error)
                toast.error('Failed to redeem reward. Please try again.')
            }
        
    }

    
    const handleShow = () => {
        getUserRewardInfo(props.id)
        setShow(true)
    } 

    // const getRewardInfo = async (id: number) => {
    //     try {
    //         const response = await axios.get(`http://localhost:8000/api/get-reward/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             }
    //         })
    //         setName(response.data.reward.name)
    //         setReqPoints(response.data.reward.points_required)
    //         setType(response.data.reward.type)
    //     } catch (error) {
    //         console.error('Error fetching reward info:', error)
    //         toast.error('Failed to fetch reward info. Please try again.')
    //     }
    // }

    const getUserRewardInfo = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/get-user-reward/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setQr(response.data.user_reward.qr_code) 
            setInviteLink(response.data.user_reward.invite_link)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching user reward info:', error)
            toast.error('Failed to fetch user reward info. Please try again.')
        }
    }

    // useEffect(() => {
    //     if(props.history){
    //         getRewardInfo(props.reward_id)
    //     }
    // }, [props])



    return <div className="bg-mine-shaft-900 p-4 w-[20rem] flex flex-col gap-3 rounded-xl ">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                    <div className="p-2 bg-mine-shaft-800 rounded-md">
                    <img className="h-7" src={`/Icons/${props.available ? `${props.name}.png` : `${props.reward.name}.png`}`} alt="" />
                    </div>
                    <div className="flex flex-col gap-1" >
                        <div className="font-semibold">Learning {props.available ? props.name : props.reward.name}</div>
                        <div className="text-xs text-mine-shaft-300">(Telegram Channel)</div>
                    </div>
                </div>
            </div>
           
                { loading ?<button 
    disabled 
    className="py-2 px-2 cursor-not-allowed bg-mine-shaft-800 text-green-400 rounded-lg text-sm text-center flex items-center justify-center hover:shadow-[0_0_5px_1px_green] !shadow-green-400"
  >
    <svg className="animate-spin h-4 w-4 mr-2 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2v4"></path>
      <path d="M12 18v4"></path>
      <path d="M4.93 4.93l2.83 2.83"></path>
      <path d="M16.24 16.24l2.83 2.83"></path>
      <path d="M2 12h4"></path>
      <path d="M18 12h4"></path>
      <path d="M4.93 19.07l2.83-2.83"></path>
      <path d="M16.24 7.76l2.83-2.83"></path>
    </svg>
    Loading...
  </button>

 : <button onClick={()=>props.invite_link?handleShow():handleRedeem(props.id, props.points_required)} className="py-2 px-2 cursor-pointer bg-mine-shaft-800 text-green-400 rounded-lg text-sm text-center hover:shadow-[0_0_5px_1px_green] !shadow-green-400" >{props.invite_link?"Show Your Reward":"Redeem Your Reward"}</button>}

            {/* <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>{props.description}</Text> */}
            <Divider size="sm" color="#4f4f4f " />
            <div className="flex justify-between">
                <div className="font-semibold text-mine-shaft-200">
                    {props.available?props.points_required:props.reward.points_required} Points
                </div>
                <div className="flex gap-1 text-xs text-mine-shaft-400 items-center">
                    <IconClockHour3 className="h-5 w-5" stroke={1.5}/> {props.invite_link?` ${processDate(props.redeemed_at,props)}`:` ${processDate(props.updated_at,props)}`} 
                </div>
            </div>

            {show && <Modal name={props.reward.name} type={props.reward.type} points={props.reward.points_required} inviteLink={inviteLink} qr={qr} setShow={setShow} />}
    
        </div>
}

const processDate = (updatedAt: string, props:any) => {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    
    // Calculate the difference in milliseconds
    const diffInMilliseconds = currentDate.getTime() - updatedDate.getTime();
    
    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 3600 * 24));

    // Return appropriate string based on the difference
    if (diffInDays < 1 && props.available) {
        return "Updated Recently"; // If the difference is less than 1 day (same day)
    }else if(diffInDays < 1 && props.history){
        return "Redeemed Recently"
    }
    
    else if (diffInDays >= 1 && props.available){
        return `Updated ${diffInDays} days ago`;
    }
    else if (diffInDays >= 1 && props.history){
        return `Redeemed ${diffInDays} days ago`;
    }
    return "";
};
export default Card;

const Modal = (props:any) => {
    console.log(props)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-mine-shaft-900 p-4 w-[25rem] flex flex-col gap-3 rounded-xl ">
            <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                <div className="p-2 bg-mine-shaft-800 rounded-md">
                    <img className="h-7" src={`/Icons/${props.name}.png`} alt="" />
                </div>
                <div className="flex flex-col gap-1" >
                    <div className="font-semibold">Learning {props.name}</div>
                    <div className="text-xs text-mine-shaft-300">(Telegram Channel)</div>
                </div>
                </div>
            </div>
            <Divider size="sm" color="#4f4f4f " />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-mine-shaft-800 p-2 rounded-md">
                <input
                    type="text"
                    value={props.inviteLink}
                    readOnly
                    className="bg-transparent text-white w-full border-none outline-none"
                />
                <button
                    onClick={() => {
                    navigator.clipboard.writeText(props.inviteLink);
                    toast.success('Invite link copied to clipboard');
                    }}
                    className="text-green-400"
                >
                    <IconCopy />
                </button>
                </div>
                <div className="w-full">
                    <div className="flex justify-center items-center">
                    <img src={`data:image/png;base64,${props.qr}`} alt="QR Code" className="w-20rem" />
                    </div>
                </div>
            </div>
            <Divider size="sm" color="#4f4f4f " />
            <Button onClick={() => props.setShow(false)} variant="outline" className="w-full mt-2">
                Close
            </Button>
            </div>
        </div>
    )
}
