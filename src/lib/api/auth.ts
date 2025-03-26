import apiClient from "./apiClient";
import { LoginForm, SignupForm } from "./interfaces/auth";
import {
  AuthResponse,
  PaginatedResponse,
  PaginationParams,
  Response,
} from "./type";

export async function signup(data: Partial<SignupForm>) {
  return await apiClient.post<Response<string>, Partial<SignupForm>>(
    `/auth/signup`,
    {
      body: data,
      withAuth: true,
    }
  );
}

export async function login(data: Partial<LoginForm>) {
  return await apiClient.post<Response<string>, Partial<LoginForm>>(
    `/auth/login`,
    {
      body: data,
      withAuth: true,
    }
  );
}

export async function userSearch(params?: PaginationParams) {
  return await apiClient.get<PaginatedResponse<LoginForm>>(`/auth/login`, {
    params: params,
    withAuth: true,
  });
}
interface CheckUsernameResponse {
  isUsernameTaken: boolean;
}

export const checkUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await fetch(`/auth/signup?username=${username}`);
    const data: CheckUsernameResponse = await response.json();
    return data.isUsernameTaken; // 서버에서 반환하는 중복 여부 값
  } catch (error) {
    console.error("아이디 중복 확인 실패", error);
    return false;
  }
};
export const checkEmail = async (email: string) => {
  try {
    const response = await fetch(`/api/check-email?email=${email}`);
    const data = await response.json();
    return data.isEmailTaken; // 중복된 이메일이 있는지 여부
  } catch (error) {
    console.error("이메일 중복 확인 실패", error);
    return false;
  }
};
