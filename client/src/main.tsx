import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AuthContextProvider from "./context/AuthContext/AuthContext.tsx";
import { SocketProvider } from "./context/SocketContext/SocketContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketProvider url="http://localhost:3000">
        <App />
      </SocketProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
