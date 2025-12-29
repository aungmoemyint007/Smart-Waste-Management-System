import { Tabs } from "@mantine/core";
import Card from "./Card";
import { Coins } from "lucide-react";
import { usePoints } from "@/context/PointsContext";
import axios from "axios";
import toast from "react-hot-toast";

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const JobHistory = () => {
    const token = localStorage.getItem('token');
    const [rewards, setRewards] = useState<any[]>([]);
    const [userRewards, setUserRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("available");
    const [fetched, setFetched] = useState(false); // To avoid redundant requests
    const fetchInProgress = useRef(false); // Track if the fetch is already in progress

    const fetchData = async () => {
        if (fetchInProgress.current || fetched) return; // Prevent redundant fetches
        fetchInProgress.current = true;
        setLoading(true);

        try {
            const [userRes, rewardsRes] = await Promise.all([
                axios.get('http://localhost:8000/api/get-user-rewards', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:8000/api/get-all-rewards', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const userRewardsData = userRes.data.user_rewards;
            setUserRewards(userRewardsData);

            // Filter available rewards
            const filteredRewards = rewardsRes.data.rewards.filter((reward: any) => {
                return !userRewardsData.some((userReward: any) => userReward.reward_id === reward.id);
            });
            setRewards(filteredRewards);

            setFetched(true); // Mark as fetched to prevent unnecessary requests
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data.");
        } finally {
            setLoading(false);
            fetchInProgress.current = false; // Reset fetch progress flag
        }
    };

    useEffect(() => {
        if (shouldFetch) {
            setFetched(false)
            fetchData();
            setShouldFetch(false); // Reset the flag to avoid re-triggering
        }

        console.log(fetched)
    }, [shouldFetch]);

    return (
        <div key={activeTab} className="py-10 px-[10rem]">
            <div className="text-2xl font-semibold mb-5">Exchange Points</div>
            <div className="flex flex-col justify-center items-center gap-5">
                <div className="w-full">
                    <PointsCard />
                </div>
                <div className="w-full">
                    <Tabs
                        variant="outline"
                        radius="lg"
                        defaultValue="available"
                        value={activeTab}
                        onChange={(value) => setActiveTab(value ?? "available")}
                    >
                        <Tabs.List className="[&_button]:!text-lg font-semibold mb-5 [&_button[data-active='true']]:text-green-400">
                            <Tabs.Tab value="available">Available</Tabs.Tab>
                            <Tabs.Tab value="history">History</Tabs.Tab>
                        </Tabs.List>
                        <div className="overflow-y-scroll overflow-x-hidden h-[80vh] pb-10">
                            <Tabs.Panel value="available">
                                <div className="px-3 flex mt-10 flex-wrap gap-5">
                                    {rewards.map((job, index) => (
                                        <Card key={index} {...job} available applied setShouldFetch={setShouldFetch}  />
                                    ))}
                                </div>
                            </Tabs.Panel>
                            <Tabs.Panel value="history">
                                <div className="flex mt-10 flex-wrap gap-5">
                                    {userRewards.map((job, index) => (
                                        <Card key={index} {...job} history saved />
                                    ))}
                                </div>
                            </Tabs.Panel>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

function PointsCard() {
    const { points } = usePoints();

    return (
        <div className="w-full mx-auto bg-mine-shaft-800 text-mine-shaft-200 p-6 rounded-2xl shadow-lg flex justify-center items-center flex-col">
            <div className="text-3xl font-medium mb-3">Available Points</div>
            <div className="text-4xl font-bold flex gap-3 items-center">
                <Coins />
                <span>{points}</span>
            </div>
            <Link to="/collect" className="mt-6 bg-green-800 text-white w-full py-2 rounded-lg font-semibold hover:bg-green-700 text-center">
                Redeem Points
            </Link>
        </div>
    );
}

export default JobHistory;
