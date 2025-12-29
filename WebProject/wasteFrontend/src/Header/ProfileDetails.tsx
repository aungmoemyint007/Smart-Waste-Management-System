import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import axios from "axios"; 
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/Slices/UserSlice";

export default function UserProfile({setOp}: any) {
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const [uuser, setUuser] = useState({
    picture: "https://via.placeholder.com/150",
    name: "John Doe",
    address: "123 Main Street, Cityville",
    phone: "123-456-7890",
    about: "Passionate about technology and innovation."
  });

  const savedUser = useSelector((state: any) => state.user);
  const token = useSelector((state: any) => state.jwt);

  // Load user data from localStorage or backend (if needed)
  useEffect(() => {
    if (savedUser) {
      setUuser(savedUser); // Only update state if savedUser exists
    }
  }, [savedUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUuser({ ...uuser, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUuser({ ...uuser, picture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
    
      // Use null if value is undefined
      const name = uuser.name ?? null;
      const address = uuser.address ?? null;
      const phone = uuser.phone ?? null;
      const about = uuser.about ?? null;
    
      formData.append("name", name);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("about", about);
    
      // Only append the picture if it has changed
      const picture = uuser.picture !== "https://via.placeholder.com/150" ? uuser.picture : null;
      if (picture) {
        formData.append("picture", picture);
      }
    
      const response = await axios.post("http://localhost:8000/api/change-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
    
      if (response.data.success) {
        // Handle success (optional: update localStorage or state)
        let updatedUser = { ...savedUser, ...response.data.data };
        dispatch(setUser(updatedUser)); // Update user in Redux store
        setEditing(false); // Close editing mode
      } else {
        console.error("Failed to update profile", response.data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  

  return (
    <Card className="!border-none bg-mine-shaft-900 p-4 w-[25rem] shadow-md rounded-xl">
      <div className="relative flex flex-col items-center gap-3">
        <label htmlFor="picture-upload" className="cursor-pointer">
          <img src={uuser.picture?`http://localhost:8000/storage/${uuser.picture}`:'/avatar.png'} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
        </label>
        {editing && <input id="picture-upload" type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />}
        <button className="absolute top-0 right-0 bg-gray-200 p-2 rounded-full" onClick={() => setEditing(!editing)}>
          <Pencil size={16} />
        </button>
      </div>
      <CardContent className="mt-4 space-y-4">
  {editing ? (
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Name
      </label>
      <Input
        id="name"
        name="name"
        value={uuser.name}
        onChange={handleChange}
        placeholder="Enter Your Name"
        className="bg-mine-shaft-800 text-white"
      />
    </div>
  ) : (
    <div className="flex justify-start gap-10 items-center">
      <label className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Name:
      </label>
      <p className="text-mine-shaft-100 text-center">{uuser.name}</p>
    </div>
  )}

  {editing ? (
    <div>
      <label htmlFor="address" className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Address
      </label>
      <Input
        id="address"
        name="address"
        value={uuser.address || ""}
        onChange={handleChange}
        placeholder="Enter Your Address"
        className="bg-mine-shaft-800 text-white"
      />
    </div>
  ) : (
    <div className="flex justify-start gap-10 items-center">
      <label className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Address:
      </label>
      <p className="text-mine-shaft-100 text-center">{uuser.address || ""}</p>
    </div>
  )}

  {editing ? (
    <div>
      <label htmlFor="phone" className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Phone Number
      </label>
      <Input
        id="phone"
        name="phone"
        value={uuser.phone || ""}
        onChange={handleChange}
        placeholder="Enter Your Phone Number"
        className="bg-mine-shaft-800 text-white"
      />
    </div>
  ) : (
    <div className="flex justify-start gap-10 items-center">
      <label className="block text-sm font-medium text-mine-shaft-100 mb-1">
        Phone Number:
      </label>
      <p className="text-mine-shaft-100 text-center">{uuser.phone || ""}</p>
    </div>
  )}

  {editing ? (
    <div>
      <label htmlFor="about" className="block text-sm font-medium text-mine-shaft-100 mb-1">
        About
      </label>
      <Textarea
        id="about"
        name="about"
        value={uuser.about || ""}
        onChange={handleChange}
        placeholder="About yourself"
        className="bg-mine-shaft-800 text-white"
      />
    </div>
  ) : (
    <div className="flex justify-start gap-10 items-center">
      <label className="block text-sm font-medium text-mine-shaft-100 mb-1">
        About:
      </label>
      <p className="text-mine-shaft-100 text-center">{uuser.about || ""}</p>
    </div>
  )}

  {editing && (
    <Button className="w-full mt-4 !bg-green-500" onClick={handleSave}>
      Save
    </Button>
  )}
</CardContent>

      <Button onClick={() => setOp(false)} variant="outline" color="red" className="w-full mt-2 text-mine-shaft-100">
        Close
      </Button>
    </Card>
  );
}
