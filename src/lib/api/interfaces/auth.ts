export interface SignupForm {
  email: string
  name: string
  username: string
  password: string
  organization: string
}

export interface LoginForm {
  username: string
  password: string
}
export interface NewPassword {
  password: string
  newPassword: string
}
