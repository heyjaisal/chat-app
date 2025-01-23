import React, { useState } from "react";
import Victory from "@/assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppstore } from "@/store/index";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [Cpassword, setCpassword] = useState("");
  const { setUserinfo } = useAppstore();

  const navigate = useNavigate();

  const validate = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== Cpassword) {
      toast.error("Passwords don't match");
      return false;
    }
    return true;
  };

  const loginvalidate = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (loginvalidate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password },
          { withCredentials: true }
        );
        setUserinfo(response.data.user); // Calling the correct function to update userInfo
        if (response.data.user.id) {
          if (response.data.user.profileSetup) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        toast.error(error.response?.data || "An error occurred");
        console.error(error);
      }
    }
  };


  const handleSignup = async () => {
    if (validate()) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          { email, password },
          { withCredentials: true }
        );
        console.log({ response });
        toast.success("Signup successful!");
      } catch (error) {
        toast.error(error.response?.data || "An error occurred");
        console.error(error);
      }
    }
  };

  return (
    <div className="h-[100vh] w-[100wh] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
        <div className="flex flex-col gap-10 item-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text:text-6xl">Welcome</h1>
              <img src={Victory} alt="victory emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              {" "}
              fill in the details to get started with the best chat app
            </p>
            <div className="flex items-center justify-center w-full">
              <Tabs className="w-3/4" defaultValue="login">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                    value="login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="flex flex-col gap-5" value="login">
                  <Input
                  placeholder='email'
                  type='email'
                  className='rounded-full p-6'
                  value={email}
                  onChange={(e)=>setemail(e.target.value)}/>
                   <Input
                  placeholder='password'
                  type='password'
                  className='rounded-full p-6'
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}/>
                  <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                </TabsContent>
                <TabsContent className="flex flex-col gap-5" value="signup">
                    <Input
                  placeholder='email'
                  type='email'
                  className='rounded-full p-6'
                  value={email}
                  onChange={(e)=>setemail(e.target.value)}/>
                   <Input
                  placeholder='password'
                  type='password'
                  className='rounded-full p-6'
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}/>
                   <Input
                  placeholder='confirm password'
                  type='password'
                  className='rounded-full p-6'
                  value={Cpassword}
                  onChange={(e)=>setCpassword(e.target.value)}/>
                  <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
