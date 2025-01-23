import Profile from "./pages/profile";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import axios from "axios";
import { useAppstore } from "@/store/index";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppstore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userInfo, setUserinfo } = useAppstore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/user-info",
          { withCredentials: true }
        );
        console.log(response);
        
        if (response.status === 200 && response.data.id) {
          setUserinfo(response.data); 
          console.log(userInfo,"we need this one");

        } else {
          setUserinfo(undefined);
          console.log(userInfo,"no userInfo");
          
        }
      } catch (error) {
        setUserinfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      setLoading(true); // Reset loading state if userInfo is undefined
      getUser(); // Re-fetch user data if userInfo is undefined
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserinfo]); // Trigger useEffect when userInfo changes

  if (loading) {
    return <div>Loading...</div>; // Show loading screen while fetching data
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
