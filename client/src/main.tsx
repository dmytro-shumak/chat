import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { config } from "./config/index.ts";
import { AuthContextProvider } from "./context/auth/AuthProvider.tsx";
import { SocketProvider } from "./context/socket/SocketProvider.tsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <SocketProvider url={config.BACKEND_URL}>
        <App />
      </SocketProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
