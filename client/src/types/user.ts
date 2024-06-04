export enum UserRole {
  User = "user",
  Admin = "admin",
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  role: UserRole;
  isMuted: boolean;
  isBanned: boolean;
}
