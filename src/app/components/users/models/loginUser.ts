export interface LoginUser {
  Email: string;
  Password: string;
}

export interface LoginResponse {
  token?: string;
  user?: any;
}




