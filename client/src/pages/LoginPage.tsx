import { ChangeEvent, FC, FormEvent, useState } from "react";
import Button from "../components/button/Button";
import FormField from "../components/form/FormField";
import { useAuth } from "../context/auth/useAuth";

const LoginPage: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginAction } = useAuth();

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(username)) {
      setError("Username can only contain letters and numbers");
      return;
    }

    setError("");

    loginAction(username, password);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 max-w-[400px] w-10/12"
        onSubmit={handleSubmit}
      >
        <FormField
          id="username"
          placeholder="Enter your username"
          value={username}
          handleValueChange={handleUsernameChange}
        />
        <FormField
          id="password"
          placeholder="Enter your password"
          type="password"
          autoComplete="on"
          value={password}
          handleValueChange={handlePasswordChange}
        />
        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <Button type="submit">Sign In</Button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
