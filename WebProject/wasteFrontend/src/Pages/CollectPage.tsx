import { useState, useEffect } from 'react'
import { Trash2, MapPin, CheckCircle, Clock, ArrowRight, Camera, Upload, Loader, Calendar, Weight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {toast} from "react-hot-toast";
import { set } from 'date-fns';
import axios from 'axios';
import { usePoints } from '@/context/PointsContext';
// import { getWasteCollectionTasks, updateTaskStatus, saveReward, saveCollectedWaste, getUserByEmail } from '@/utils/db/actions'
// import { GoogleGenerativeAI } from "@google/generative-ai"

// Make sure to set your Gemini API key in your environment variables
// const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

type CollectionTask = {
  id: number
  location: string
  waste_type: string
  amount: string
  status: 'pending' | 'in_progress' | 'rejected' | 'verified'
  reported_date: string
  collector_id: number | null
  reporter_id: number | null
}

const ITEMS_PER_PAGE = 5

export default function CollectPage() {
  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user") || '{}')
  const [tasks, setTasks] = useState<CollectionTask[]>([])
  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState<number | null>(null)
  const [hoveredWasteType, setHoveredWasteType] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [verificationImage, setVerificationImage] = useState<File | null>(null)
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const {points, setPoints} = usePoints();
  const [state, setState] = useState<any>("")
  const [verificationResult, setVerificationResult] = useState<{
    wasteTypeMatch: boolean;
    quantityMatch: boolean;
    confidence: number;
    reason: string;
  } | null>(null)
  

  useEffect(()=>{
    const fetchAllReports = async() => {
      setLoading(true)
      try{
        const response = await fetch("http://localhost:8000/api/show-all-reports",{
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        setTasks([...data.reports])
        setLoading(false)
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }

    fetchAllReports();
  },[])


  
  const handleStatusChange = async (taskId: number, newStatus: CollectionTask['status'], pointsEarned:(number|null)=null) => {
    if (!user) {
      toast.error('Please log in to collect waste.')
      return
    }

    setButtonLoading(taskId)

    try {
      const response = await fetch("http://localhost:8000/api/update-report-status", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: taskId, status: newStatus, pointsEarned: pointsEarned })
      })

      let updatedTask = await response.json();


      if (updatedTask) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus, collector_id: user.id } : task
        ))
        // toast.success('Task status updated successfully')
      } else {
        toast.error('Failed to update task status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      toast.error('Failed to update task status. Please try again.')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  

  const handleVerify = async () => {
    if (!selectedTask || !verificationImage || !user) {
      toast.error('Missing required information for verification.')
      return
    }

    setVerificationStatus('verifying')
    
    try {
      const formData = new FormData()
      formData.append('image', verificationImage)
      formData.append('waste_type', selectedTask.waste_type)
      formData.append('amount', selectedTask.amount)
      formData.append('report_id', selectedTask.id.toString())

      const response = await axios.post('http://localhost:8000/api/verify-collect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      

      if (response.data.verificationResult.status === 'success') {
      setVerificationResult({...response.data.verificationResult})
      setVerificationStatus('success')
      setPoints(points + response.data.verificationResult.pointsEarned)
      // console.log(points)
      handleStatusChange(selectedTask.id, 'verified', response.data.verificationResult.pointsEarned)
      toast.success('Report verified successfully and points earned.')
      } else {
      setVerificationStatus('failure')
      handleStatusChange(selectedTask.id, 'pending')
      setButtonLoading(null)
      toast.error('Report verification failed. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying report:', error)
      setVerificationStatus('failure')
      toast.error('Failed to verify report. Please try again.')
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageCount = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleCompleBtn = (task: CollectionTask) => {
    setSelectedTask(task)
  }


  console.log(verificationResult)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-green-500">Waste Collection Tasks</h1>
      
      <div className="mb-4 flex items-center ">
      
      <Input
        type="text"
        placeholder="Search by area..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mr-2 bg-mine-shaft-800 border-none outline-none text-white"
      />

        <Button variant="default" className='bg-mine-shaft-800 border-none hover:bg-mine-shaft-900' size="icon">
          <Search className="h-4 w-4 text-mine-shaft-200 " />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedTasks.map(task => (
              <div key={task.id} className="bg-mine-shaft-800 p-4 rounded-lg shadow-sm border border-none">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-green-400 flex items-center mb-2">
                    <MapPin className="w-5 h-5 mr-2 text-green-500" />
                    {task.location}
                  </h2>
                  <StatusBadge status={task.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-mine-shaft-100 mb-3">
                  <div className="flex items-center relative">
                    <Trash2 className="w-4 h-4 mr-2 text-mine-shaft-100 font-semibold" />
                    <span 
                      onMouseEnter={() => setHoveredWasteType(task.waste_type)}
                      onMouseLeave={() => setHoveredWasteType(null)}
                      className="cursor-pointer font-semibold"
                    >
                      {task.waste_type.length > 8 ? `${task.waste_type.slice(0, 8)}...` : task.waste_type}
                    </span>
                    {hoveredWasteType === task.waste_type && (
                      <div className="absolute left-0 top-full mt-1 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
                        {task.waste_type}
                      </div>
                    )}
                    
                  </div>
                  <div className="flex items-center font-semibold">
                    <Weight className="w-4 h-4 mr-2 text-mine-shaft-100 font-semibold" />
                    {task.amount}
                  </div>
                  <div className="flex items-center font-semibold">
                    <Calendar className="w-4 h-4 mr-2 text-mine-shaft-100 font-semibold" />
                    {task.reported_date} 
                  </div>
                </div>
                <div className="flex justify-end">
                  {task.status === 'pending' && (
                    <Button 
                      onClick={() => handleStatusChange(task.id, 'in_progress')} 
                      className='border border-yellow-300' 
                      variant="outline" 
                      size="sm"
                      disabled={buttonLoading === task.id}
                    >
                      {buttonLoading === task.id ? (
                      <Loader className="animate-spin h-4 w-4" />
                      ) : (
                      'Start Collection'
                      )}
                    </Button>
                  )}
                  {task.status === 'in_progress' && task.collector_id === user?.id && (
                    <Button onClick={() => handleCompleBtn(task)}  variant="outline" size="sm">
                      Complete & Verify
                    </Button>
                  )}
                  {task.status === 'in_progress' && task.collector_id !== user?.id && (
                    <span className="text-blue-300 text-sm font-medium">In progress by another collector</span>
                  )}
                  {task.status === 'verified' && (
                    <span className="text-green-600 text-sm font-medium">Points Earned</span>
                  )}
                </div>
              </div>
             ))} 
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="mr-2"
            >
              Previous
            </Button>
            <span className="mx-2 self-center">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="ml-2"
            >
              Next
            </Button>
          </div>
        </>
      )}

      {selectedTask && selectedTask.status === "in_progress" &&  (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-mine-shaft-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-green-400 mb-4">Verify Collection</h3>
            <p className="mb-4 text-sm text-mine-shaft-100">Upload a photo of the collected waste to verify and earn your points.</p>
            <div className="mb-4">
              <label htmlFor="verification-image" className="block text-sm font-medium text-green-200 mb-2">
                Upload Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="verification-image"
                      className="relative cursor-pointer bg-mine-shaft-50 p-1 left-5 mb-1 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="verification-image" name="verification-image" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                    </label>
                  </div>
                  <p className="text-xs text-green-200">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            {preview && (
              <img src={preview} alt="Verification" className="mb-4 rounded-md w-full" />
            )}
            <Button
              onClick={handleVerify}
              className="w-full bg-green-500 hover:bg-green-600 text-white"

              disabled={!verificationImage || verificationStatus === 'verifying'}
            >
              {verificationStatus === 'verifying' ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  Verifying...
                </>
              ) : 'Verify Collection'}
            </Button>
            {verificationStatus === 'success' && verificationResult && (
              <div className="mt-4 p-4 bg-green-200 text-black border border-green-400 rounded-md">
                <p>Waste Type Match: {verificationResult.wasteTypeMatch ? 'Yes' : 'No'}</p>
                <p>Quantity Match: {verificationResult.quantityMatch ? 'Yes' : 'No'}</p>
                <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
              </div>
            )}
            {verificationStatus === 'failure' && (<>
                  <p className="mt-2 text-red-400 font-semibold text-sm text-center">Verification failed. Please try again.</p>
              <div className="mt-4 p-4 bg-mine-shaft-600 rounded-md">
                  <p>Reason: {verificationResult?.reason?verificationResult?.reason:"Something went Wrong"}</p>
            </div></>
            )}
            <Button onClick={() => setSelectedTask(null)} variant="outline" className="w-full mt-2">
              Close
            </Button>
          </div>
        </div>
      )} 

      {/* Add a conditional render to show user info or login prompt */}
      {/* {user ? (
        <p className="text-sm text-gray-600 mb-4">Logged in as: {user.name}</p>
      ) : (
        <p className="text-sm text-red-600 mb-4">Please log in to collect waste and earn rewards.</p>
      )} */}
    </div>
  )
}

 function StatusBadge({ status }: { status: any }) {
  const statusConfig:any = {
    pending: { color: 'bg-yellow-200 text-yellow-800', icon: Clock },
    failure: { color: 'bg-yellow-200 text-yellow-800', icon: Clock },
    rejected: { color: 'bg-yellow-200 text-yellow-800', icon: Clock },
    in_progress: { color: 'bg-blue-100 text-blue-800', icon: Trash2 },
    completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    verified: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  }

  const { color, icon: Icon } = statusConfig[status]
  console.log(color)

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color} flex items-center`}>
      <Icon className="mr-1 h-3 w-3" />
      {status.replace('_', ' ')}
    </span>
  )
}