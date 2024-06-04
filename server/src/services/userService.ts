import { IUser } from "../model/User";

interface User {
  id: IUser["_id"];
  username: string;
  role: string;
  muted: boolean;
  banned: boolean;
}

const users: User[] = [];

export const addUser = (userInfo: IUser): User => {
  let user = users.find((u) => u.id === userInfo._id);
  if (!user) {
    user = {
      id: userInfo._id,
      username: userInfo.username,
      muted: false,
      banned: false,
      role: userInfo.role,
    };
    users.push(user);
  }
  return user;
};

export const removeUser = (id: string): User | undefined => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

export const getUser = (id: string): User | undefined => users.find((user) => user.id === id);

export const getUsers = (): User[] => users;
