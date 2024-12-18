import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import signupGIF from "../../../public/SignupGIF.gif";
import {RegistrationService} from "../services/Signup.services"
import Header from "../header";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRegister = async () => {
    try {
      const response = await RegistrationService.register({ username, email, password });
      if (response.message === "Email already exists" || response.message === "Username already exists") {
        setErrorMessage(response.message);
      } else if (response.message === "User registered successfully, please verify your email") {
        setOtpSent(true);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error as string);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await RegistrationService.verifyOTP({ email, otp });
      if (response.message === "OTP verified successfully") {
        setRegistrationSuccess(true);
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage(error as string);
    }
  };

  return (
    <>
    
    <div className="min-h-screen p-10 flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        {/* Left side - Signup Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-2xl font-bold">
              PharynxOCR<span className="text-red-500">❤️</span>
            </h2>
          </div>
          <h2 className="text-2xl font-semibold text-center mb-8">
            Create your account
          </h2>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6 justify-center">
            <Button className="bg-blue-600 text-white flex items-center w-full justify-center">
              <i className="fab fa-facebook mr-2"></i> Facebook
            </Button>
            <Button className="border border-gray-300 flex items-center w-full justify-center">
              <i className="fab fa-google mr-2"></i> Google
            </Button>
            <Button className="border border-gray-300 flex items-center w-full justify-center">
              <i className="fas fa-user mr-2"></i> SSO
            </Button>
          </div>

          <Input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <Input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />

          <Button onClick={handleRegister} className="w-full bg-red-500 text-white">
            Sign up
          </Button>
          {errorMessage && (
            <p className="text-red-500 mt-2">{errorMessage}</p>
          )}

          {otpSent && !registrationSuccess && (
            <div className="mt-4">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleVerifyOTP} className="w-full bg-green-500 text-white">
                Verify OTP
              </Button>
            </div>
          )}
          {registrationSuccess && (
            <p className="text-green-500 mt-2">Registration Successful!</p>
          )}

          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-red-500">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 bg-gray-100 flex flex-col items-center justify-center p-8">
          <img
            src={signupGIF}
            alt="Signup GIF"
            className="mb-4 w-3/4 md:w-full"
            loading="lazy"
          />
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Create your workspace
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Sign up to access your PharynxOCR account and start boosting your
            document productivity.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupPage;
