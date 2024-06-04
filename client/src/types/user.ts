export enum UserRole {
  User = "user",
  Admin = "admin",
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  role: UserRole;
  isMuted: boolean;
  isBanned: boolean;
}
