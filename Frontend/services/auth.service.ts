import axios from "axios";
import {
  UserSignInDto,
  UserSignUpDto,
  SupervisorSignInDto,
  SupervisorSignUpDto,
  SignerSignInDto,
  SignerSignUpDto,
} from "../dto/auth.dto";

// Response type
interface LoginResponse {
  accessToken: string;
}

export class AuthService {
  private static BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  constructor() {
    axios
      .get(`${AuthService.BACKEND_URL}`)
      .then((response) => {
        console.log("Backend health check response:", response.data);
      })
      .catch((error) => {
        console.error("Error checking backend health:", error);
      });
    if (!AuthService.BACKEND_URL) {
      throw new Error(
        "Backend URL is not defined. Please set NEXT_PUBLIC_BACKEND_URL."
      );
    } else {
      console.log(
        "AuthService initialized with backend URL:",
        AuthService.BACKEND_URL
      );
    }
  }

  // User authentication
  static async userLogin(data: UserSignInDto): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.BACKEND_URL}/auth/user/login`,
        data
      );

      this.saveTokenData(response.data.accessToken, "USER");
      this.decodeAndLogToken(response.data.accessToken);
      return response.data;
    } catch (error: unknown) {
      console.log("Error during user login:", error);
      throw error;
    }
  }

  static async userRegister(data: UserSignUpDto): Promise<void> {
    try {
      const response = await axios.post(
        `${this.BACKEND_URL}/auth/user/register`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Supervisor authentication
  static async supervisorLogin(
    data: SupervisorSignInDto
  ): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.BACKEND_URL}/auth/supervisor/login`,
        data
      );

      this.saveTokenData(response.data.accessToken, "SUPERVISOR");
      this.decodeAndLogToken(response.data.accessToken);
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  static async supervisorRegister(data: SupervisorSignUpDto): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BACKEND_URL}/auth/supervisor/register`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Signer authentication
  static async signerLogin(data: SignerSignInDto): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${this.BACKEND_URL}/auth/signer/login`,
        data
      );

      this.saveTokenData(response.data.accessToken, "SIGNER");
      this.decodeAndLogToken(response.data.accessToken);
      return response.data;
    } catch (error: unknown) {
      console.log("Error during signer login:", error);
      throw error;
    }
  }

  static async signerRegister(data: SignerSignUpDto): Promise<any> {
    try {
      const response = await axios.post(
        `${this.BACKEND_URL}/auth/signer/register`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // Helper methods
  private static saveToken(token: string, role: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userRole", role);
    }
  }

  private static saveTokenData(token: string, role: string): void {
    if (typeof window !== "undefined") {
      try {
        // Decode the token to extract user ID
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));

          // Save to localStorage
          localStorage.setItem("accessToken", token);
          localStorage.setItem("userRole", role);
          localStorage.setItem("userId", payload.id || "");
          console.log("Token parts:", tokenParts);

          // Set cookies for middleware access
          document.cookie = `accessToken=${token}; path=/; max-age=86400`;
          document.cookie = `userRole=${role}; path=/; max-age=86400`;
          document.cookie = `userId=${payload.id || ""}; path=/; max-age=86400`;
        }
      } catch (error) {
        console.error("Error parsing token data:", error);
        // Fallback to basic token storage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userRole", role);

        // Set cookies for middleware access
        document.cookie = `accessToken=${token}; path=/; max-age=86400`;
        document.cookie = `userRole=${role}; path=/; max-age=86400`;
      }
    }
    // Notify about auth change
    this.notifyAuthChange();
  }

  private static notifyAuthChange(): void {
    if (typeof window !== "undefined") {
      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new Event("authChange"));
    }
  }

  static decodeAndLogToken(token: string): void {
    try {
      // Decode JWT token (no library needed for basic decoding)
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log("Decoded JWT token payload:", payload);
        // Log specific fields
        if (payload.id) console.log("User ID:", payload.id);
        if (payload.role) console.log("Role:", payload.role);
        if (payload.exp) {
          const expDate = new Date(payload.exp * 1000);
          console.log("Token expires:", expDate.toLocaleString());
        }
      }
    } catch (error) {
      console.error("Error decoding JWT token:", error);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  static getUserId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  }

  static getUserRole(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole");
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");

      // Clear cookies
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "userRole=; path=/; max-age=0";
      document.cookie = "userId=; path=/; max-age=0";
    }
    // Notify about auth change
    this.notifyAuthChange();
  }
}
