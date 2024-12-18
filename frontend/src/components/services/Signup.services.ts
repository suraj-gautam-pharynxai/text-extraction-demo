import axios from "axios";

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

interface VerifyOTPPayload {
  email: string;
  otp: string;
}

export const RegistrationService = {
  async register(payload: RegisterPayload) {
    console.log("RegistrationService.register: ", payload)
    try {
      const response = await axios.post("http://localhost:8000/register", payload);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.detail : "Registration failed";
    }
  },

  async verifyOTP(payload: VerifyOTPPayload) {
    console.log("RegistrationService.verifyOTP: ", payload)

    try {
      const formData = new FormData();
      formData.append("email", payload.email);
      formData.append("otp", payload.otp);

      const response = await axios.post("http://localhost:8000/verify-otp", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data.detail : "OTP verification failed";
    }
  },
};
