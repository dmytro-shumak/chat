import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext/AuthContext";
import LoginPage from "./pages/LoginPage";

function App() {
  const { checkToken } = useContext(AuthContext);
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
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<div>chat</div>} />
      </Routes>
    </div>
  );
}

export default App;