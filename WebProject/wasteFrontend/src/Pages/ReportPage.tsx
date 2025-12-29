import { useEffect, useState } from "react";
import axios from "axios";
import { MapPin, Upload, CheckCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from "react-hot-toast";
import { usePoints } from "@/context/PointsContext";

const ReportPage = () => {
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle');
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submit, setSubmit] = useState(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const {points, setPoints} = usePoints();

  const token = localStorage.getItem('token')
  const [reports, setReports] = useState<Array<{
    id: number;
    user_id: number;
    location: string;
    waste_type: string;
    amount: string;
    recycle_or_not: string;
    status: string;
    updated_at: any;
    verification_result: {confidence: string}
    reason: string;
    image_url: string;
    reported_date: any;
  }>>([]);


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get-all-reports", {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        const data = await response.json();
        
        setReports([...data.reports]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, [submit]);




  const [newReport, setNewReport] = useState({
    location: '',
    type: '',
    amount: '',
    recycleorNot: '',
    reason: '',
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleVerify = async () => {
    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    setIsVerifying(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8000/api/verify-waste', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });

      console.log(response.data)

      if (response.data.wasteDetails.status === 'success') {
        
        setVerificationStatus('success');
        setVerificationResult({...response.data.wasteDetails});
        setNewReport((prev) => ({
          ...prev,
          type: response.data.wasteDetails.wasteType,
          amount: response.data.wasteDetails.quantity,
          recycleorNot: response.data.wasteDetails.recycle,
          reason: response.data.wasteDetails.reason,
        }));
        
        toast.success('Verification successful!');
      } else {
        setVerificationStatus('failure');
        toast.error('Verification failed. Please try again.');
      }
    } catch (error) {
      console.log(error)
      toast.error('Verification failed:');
      setVerificationStatus('failure');
    } finally {
      setIsVerifying(false);
    }
  };



  const handleSubmit = async () => {
    if (verificationStatus !== 'success') {
      toast.error("Please verify the waste before submitting.");
      return;
    }
    setSubmit(false)
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('location', newReport.location);
      formData.append('type', newReport.type);
      formData.append('amount', newReport.amount);
      formData.append('recycle', newReport.recycleorNot);
      formData.append('reason', newReport.reason);
      formData.append('confidence', verificationResult.confidence);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch("http://localhost:8000/api/create-report", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });


      console.log(response)
      const data = await response.json()
      console.log(data)

    
      
      if (response.ok) {
        toast.success('Report submitted successfully!');
        setImage(null);
        setPreview(null);
        setNewReport({ location: '', type: '', amount: '', recycleorNot: '', reason: '' });
        setVerificationResult(null);
        setSubmit(true)
        setPoints(points + 10);
      } else {
        setSubmit(true)
        toast.error('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 px-2 lg:px-40 max-w-full bg-mine-shaft-950">
      <h1 className="text-3xl font-semibold mb-6 text-mine-shaft-100 inline">Report <span className="text-green-500">waste</span></h1>
      
      <form className="mt-12 rounded-2xl shadow-lg mb-12">
        <div className="mb-8">
          <label htmlFor="waste-image" className="block text-xl text-center pb-5 font-semibold text-mine-shaft-50 mb-2">
            Upload Waste Image
          </label>
          <div className="mt-1 flex justify-center items-center h-[300px] px-6 pt-5 pb-6 border-2 border-green-500 border-dashed rounded-xl hover:border-green-500 transition-colors duration-300">
            <div className="space-y-1 text-center flex flex-col gap-3">
              <Upload className="mx-auto h-16 w-16 text-mine-shaft-100" />
              <div className="flex items-center text-lg text-mine-shaft-50">
                <label
                  htmlFor="waste-image"
                  className="relative cursor-pointer bg-mine-shaft-800 p-2 rounded-md font-medium text-green-400 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input id="waste-image" name="waste-image" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-mine-shaft-50">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        {preview && (
          <div className="mt-4 mb-8">
            <img src={preview} alt="Waste preview" className="max-w-full h-auto rounded-xl shadow-md" />
          </div>
        )}
        
        <Button 
          type="button" 
          onClick={handleVerify} 
          className="w-full mb-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-xl transition-colors duration-300" 
          disabled={isVerifying}
        >
          {isVerifying ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Verifying...
            </>
          ) : 'Verify Waste'}
        </Button>

        {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-green-800">Verification Successful</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Waste Type: {verificationResult.wasteType}</p>
                  <p>Quantity: {verificationResult.quantity}</p>
                  <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationStatus === 'failure' && (
          <div className="bg-green-50 border-l-4 border-rose-400 p-4 mb-8 rounded-r-xl">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-rose-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-rose-800">Verification Failed</h3>
                <div className="mt-2 text-sm text-rose-700">
                  <p>Your image is not real waste!!!</p>
                  {/* <p>Confidence: {(verificationResult.confidence * 100).toFixed(2)}%</p> */}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="mb-8 ">
            <label htmlFor="location" className="block text-md font-semibold text-mine-shaft-50 mb-1">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              onChange={(e) => {
                setNewReport({ ...newReport, location: e.target.value });
              }}
              required
              className="w-full px-4 py-2 bg-mine-shaft-700 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-300"
              placeholder="Enter waste location"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-md font-semibold text-mine-shaft-50 mb-1">Waste Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newReport.type}
              // onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-mine-shaft-700 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-300"
              placeholder="Verified waste type"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-md font-semibold text-mine-shaft-50 mb-1">Estimated Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={newReport.amount}
              // onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-mine-shaft-700 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-300"
              placeholder="Verified amount"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="recycleorNot" className="block text-md font-semibold text-mine-shaft-50 mb-1">Recycle or Not</label>
            <input
              type="text"
              id="recycleorNot"
              name="type"
              value={newReport.recycleorNot}
              // onChange={handleInputChange}
              required
              className="w-full px-4 py-2 bg-mine-shaft-700 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-300"
              placeholder="Recyle or Not"
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="reason"
              className="block text-md font-semibold text-mine-shaft-50 mb-1"
            >
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={newReport.reason}
              // onChange={handleInputChange}
              required
              className=" min-h-[300px]   border border-gray-300  overflow-hidden resize-none whitespace-pre-wrap w-full px-4 py-2 bg-mine-shaft-700 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-300"
              placeholder="Reason"
              readOnly
            />
          </div>
        </div>
        

        

        <Button 
          type="submit" 
          onClick={handleSubmit}
          aria-disabled={isSubmitting || verificationStatus !== 'success'}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg rounded-xl transition-colors duration-300 flex items-center justify-center"
          disabled={isSubmitting || verificationStatus !== 'success'}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              Submitting...
            </>
          ) : 'Submit Report'}
        </Button>
      </form>

      <h2 className="text-3xl font-semibold mb-6 text-mine-shaft-50">Recent <span className="text-green-500">Reports</span></h2>
      <div className="bg-mine-shaft-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-mine-shaft-600 sticky top-0">
              <tr>
                <th className="md:px-6 px-3 md:py-3 py-1 text-left md:text-xs text-[8px] font-medium text-mine-shaft-50 uppercase md:tracking-wider">Location</th>
                <th className="md:px-6 px-3 md:py-3 py-1 text-left md:text-xs text-[8px] font-medium text-mine-shaft-50 uppercase md:tracking-wider">Type</th>
                <th className="md:px-6 px-3 md:py-3 py-1 text-left md:text-xs text-[8px] font-medium text-mine-shaft-50 uppercase md:tracking-wider">Amount</th>
                <th className="md:px-6 px-3 md:py-3 py-1 text-left md:text-xs text-[8px] font-medium text-mine-shaft-50 uppercase md:tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mine-shaft-500">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-mineshaft-900 transition-colors duration-200 w-[50px]">
                  <td className="md:px-6 px-3 md:py-4 py-2 whitespace-nowrap md:text-sm text-xs text-mine-shaft-50">
                    <MapPin className="inline-block w-4 h-4 mr-2 text-green-500" />
                    {report.location}
                  </td> 
                  <td className="md:px-6 px-3 md:py-4 py-2 whitespace-nowrap md:text-sm text-xs text-mine-shaft-50">{report.waste_type}</td>
                  <td className="md:px-6 px-3 md:py-4 py-2 whitespace-nowrap md:text-sm text-xs text-mine-shaft-50">{report.amount}</td>
                  <td className="md:px-6 px-3 md:py-4 py-2 whitespace-nowrap md:text-sm text-xs text-mine-shaft-50">{new Date(report.reported_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



export default ReportPage;