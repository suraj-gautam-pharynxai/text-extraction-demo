import axios from "axios";

interface LoginResponse {
  access_token: string;
  token: string;
}

const loginService = {
  async loginUser(userName: string, password: string): Promise<LoginResponse> {
    console.log("LoginService.loginUser", userName, password);
    const response = await axios.post<LoginResponse>(`${import.meta.env.VITE_TEST_AUTH_API}/login`, {
      username: userName,
      password: password,
    });
    return response.data;
  },

  googleLogin(): void {
    window.location.href = "http://localhost:8000/login/google";
  },

  microsoftLogin(): void {
    window.location.href = "http://localhost:8000/login/microsoft";
  },
};

export default loginService;
