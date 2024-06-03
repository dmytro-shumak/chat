export interface IUser {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
  isMuted: boolean;
  isBanned: boolean;
}
