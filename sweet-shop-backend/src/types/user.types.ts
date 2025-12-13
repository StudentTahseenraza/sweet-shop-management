export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;  // Changed from UserRole enum to string
  createdAt: Date;
  updatedAt: Date;
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
  role: string;  // Changed from UserRole enum to string
}

export interface IRequestWithUser extends Request {
  user?: IJWTPayload;
}