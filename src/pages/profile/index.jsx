import React, { useEffect, useRef, useState } from "react";
import { useAppstore } from "@/store/index";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Host } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const [firstName, setfirstName] = useState("");
  const { userInfo, setUserinfo } = useAppstore();
  const [lastName, setlastName] = useState("");
  const [image, setimage] = useState(null);
  const [hovered, sethovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setfirstName(userInfo.firstName);
      setlastName(userInfo.lastName);
    }
    if(userInfo.image){
      setimage(`${Host}/${userInfo.image}`)
    }
  }, [userInfo]);

  const validate = () => {
    if (!firstName) {
      toast.error("Firstname is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
    }
    return true;
  };

  const saveChanges = async () => {
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/update-profile",
          { firstName, lastName },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.id) {
          setUserinfo({ ...response.data });
          toast.success("Profile updated succesfully");
          navigate("/chat");
          setfirstName("");
          setlastName("");
        }
      } catch (error) {}
    }
  };
  const handleback = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup the error");
    }
  };

  const handlefileclick = () => {
    fileInputRef.current.click();
  };

  const handleImage = async (event) => {
    const file = event.target.files[0];
    console.log({ file });

    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await axios.post(
        "http://localhost:5000/api/auth/add-image",
        formData,
        { withCredentials: true }
      );
      if (response.status === 200 && response.data.image) {
        setUserinfo({ ...userInfo, image: response.data.image });
        toast.success("image updated succesfully");
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      setimage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const deleteimage = async () => {
    try{

      const response = await axios.delete("http://localhost:5000/api/auth/remove-image",{withCredentials:true})
      if(response.status === 200){
        setUserinfo({...userInfo,image:null})
        toast.success("Image removed succesfully")
        setimage(null)
      }
    }catch(error){
console.log(error);

    }
  };
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBackOutline
            onClick={handleback}
            className=" text-4xl lg:text-6xl text-white/90 cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => sethovered(true)}
            onMouseLeave={() => sethovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className="uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center">
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                onClick={image ? deleteimage : handlefileclick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImage}
              name="profile-image"
              accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <input
                type="email"
                placeholder="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c3e3b] border-none"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="firstName"
                value={firstName}
                onChange={(e) => setfirstName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c3e3b] border-none"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Lastname"
                value={lastName}
                onChange={(e) => setlastName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c3e3b] border-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
