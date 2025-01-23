import React, { useEffect } from "react";
import { useAppstore } from "@/store/index";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Chat = () => {
  const navigate = useNavigate();
  const { userInfo } = useAppstore();

  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast("Please setup your profile to continue");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div>
      <h1>Chat App</h1>
    </div>
  );
};

export default Chat;
