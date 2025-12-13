export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserCreate {
  email: string;
  password: string;
  name: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: string;
}