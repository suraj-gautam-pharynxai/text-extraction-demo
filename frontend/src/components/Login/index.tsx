import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import loginGIF from "/loginGIF.gif";
import loginService from "../services/Login.service"
import Header from "../header";

const LoginPage: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginService.loginUser(userName, password);

      console.log("API Response:", data);
      console.log("Access Token:", data.token);
      
      dispatch(login({ token: data.access_token, user: { userName } }));

      localStorage.setItem("email", userName);
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      console.log(error);
    }
  };

  const handleGoogleLogin = (): void => {
    loginService.googleLogin();
  };

  const handleMicrosoftLogin = (): void => {
    loginService.microsoftLogin();
  };

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  return (

    <>
    
    <div className="min-h-screen  p-10 flex items-center justify-center bg-gray-50">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-2xl font-bold">
              PharynxOCR <span className="text-red-500">❤️</span>
            </h2>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Login to your account 
          </h2>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 justify-center">
            <Button
              className="bg-blue-600 text-white flex items-center w-full justify-center"
              onClick={handleMicrosoftLogin}
            >
              Microsoft
            </Button>
            <Button
              className="border border-gray-300 flex items-center w-full justify-center"
              onClick={handleGoogleLogin}
            >
              Google
            </Button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={userName}
              onChange={handleUserNameChange}
              placeholder="Username"
              required
              className="mb-4"
            />
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
              className="mb-4"
            />

            <div className="text-right mb-4">
              <Link to="/forgot-password" className="text-red-500 text-sm">
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-red-500 text-white">
              Log in
            </Button>
          </form>
          {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link to="/signUp" className="text-red-500">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
          <img
            src={loginGIF}
            alt="Login GIF"
            className="mb-4 w-3/4 md:w-full"
            loading="lazy"
          />
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Log in to your workspace
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Enter your email and password to access your PharynxOCR account. You
            are one step closer to boosting your document productivity.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
