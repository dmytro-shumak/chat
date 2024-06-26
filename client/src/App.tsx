import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/auth/useAuth";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const { checkToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const data = await checkToken();
      if (data) {
        navigate("/chat");
      } else {
        navigate("/login");
      }
    };

    checkTokenValidity();
  }, [checkToken, navigate]);

  return (
    <div className="h-full">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
