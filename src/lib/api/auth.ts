import apiClient from "./apiClient";
import { LoginForm, SignupForm } from "./interfaces/auth";
import { AuthResponse } from "./type";

export async function signup(data: Partial<SignupForm>) {
  return await apiClient.post<AuthResponse, Partial<SignupForm>>(
    `/auth/signup`,
    {
      body: data,
      withAuth: true,
    }
  );
}

export async function login(data: Partial<LoginForm>) {
  return await apiClient.post<AuthResponse, Partial<LoginForm>>(`/auth/login`, {
    body: data,
    withAuth: true,
  });
}
