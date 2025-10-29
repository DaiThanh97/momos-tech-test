import axios, { AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import { StorageKey } from "../types";
import type { AuthResponse } from "../types";

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

class UserService {
  private readonly apiUrl =
    process.env.REACT_APP_API_URL || "http://localhost:3000";

  async logIn(
    username: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return axios.post(`${this.apiUrl}/auth/login`, {
      username,
      password,
    });
  }

  async signUp(
    username: string,
    password: string,
    name: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return axios.post(`${this.apiUrl}/auth/signUp`, {
      username,
      password,
      name,
    });
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return Date.now() >= decoded.exp * 1000;
    } catch (err) {
      console.error("Error decoding token:", err);
      return true;
    }
  }

  setToken(token: string): void {
    localStorage.setItem(StorageKey.USER_TOKEN, token);
  }

  setName(name: string): void {
    localStorage.setItem(StorageKey.NAME, name);
  }

  getToken(): string | null {
    return localStorage.getItem(StorageKey.USER_TOKEN);
  }

  getName(): string | null {
    return localStorage.getItem(StorageKey.NAME);
  }

  clearStorage(): void {
    localStorage.removeItem(StorageKey.USER_TOKEN);
    localStorage.removeItem(StorageKey.NAME);
  }
}

export const userService = new UserService();
