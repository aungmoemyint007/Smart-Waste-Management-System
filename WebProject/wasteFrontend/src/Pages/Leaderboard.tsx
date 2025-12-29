'use client'
import { useState, useEffect } from 'react'
import { Loader, Award, User, Trophy, Crown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import axios from 'axios'

type Reward = {
  id: number
  user_id: number
  points: number
  level: number
  created_at: Date
  updated_at: Date
  is_available: boolean
  description: string|null
  name: string
  collectionInfo: string|null
  user_name: string | null
  user_picture: string | null
}

export default function LeaderboardPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
  const token = localStorage.getItem('token')
  useEffect(() => {
    const fetchRewardsAndUser = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://localhost:8000/api/leaderboard',{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
  
        let fetchedRewards: Reward[] = [...response.data.points]
        
        // Sort rewards by points in descending order
        fetchedRewards.sort((a, b) => b.points - a.points)
  
        console.log(fetchedRewards)
        setRewards(fetchedRewards)
      } catch (error) {
        console.error('Error fetching rewards and user:', error)
        toast.error('Failed to load leaderboard. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  
    fetchRewardsAndUser()
  }, [])
  

  return (
    <div className="mt-[3rem]">
      <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-green-400">Leaderboard </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin h-8 w-8 text-gray-600" />
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex justify-between items-center text-white">
                <Trophy className="h-10 w-10" />
                <span className="text-2xl font-bold">Top Performers</span>
                <Award className="h-10 w-10" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mine-shaft-600 divided-y divide-mine-shaft-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-mine-shaft-50 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-mine-shaft-50 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-mine-shaft-50 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-mine-shaft-500'>
                  {rewards?.map((reward, index) => (
                    <tr key={reward.id} className={`${user && user.id === reward.user_id ? 'bg-mine-shaft-800' : 'bg-mine-shaft-600'} hover:bg-mine-shaft-900 shadow-sm  transition-colors duration-150 ease-in-out`}>
                      <td className="px-6 py-4 text-mine-shaft-50 whitespace-nowrap">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <Crown className={`h-6 w-6 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} />
                          ) : (
                            <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {/* <User className="h-full w-full rounded-full bg-gray-200 text-gray-500 p-2" /> */}
                            <img src={reward.user_picture?"http://localhost:8000/storage/"+reward.user_picture:"/avatar.png"} alt="avatar" className="h-10 w-10 rounded-full" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-mine-shaft-50">{reward.user_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Award className="h-5 w-5 text-indigo-500 mr-2" />
                          <div className="text-sm font-semibold text-mine-shaft-50">{reward.points.toLocaleString()}</div>
                        </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}