import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react"


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/forgot-password",
        new URLSearchParams({ email })
      );
      if (response.data.message === "OTP sent for password reset") {
        navigate("/reset-password", { state: { email } });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      const message =
        error.response && error.response.data && error.response.data.detail
          ? error.response.data.detail
          : "Failed to send OTP";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Forgot Password
        </h2>

        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
        />

        <Button
          onClick={handleSendOTP}
          className="w-full bg-blue-600 text-white"
        >
          Send OTP
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
