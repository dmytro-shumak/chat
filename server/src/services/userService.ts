import User, { IUser } from "../model/User";

interface User {
  id: IUser["_id"];
  username: string;
  role: string;
  muted: boolean;
  banned: boolean;
}

const onlineUsers: User[] = [];

export const addOnlineUser = (userInfo: IUser): User => {
  let user = onlineUsers.find((u) => u.id === userInfo._id);
  if (!user) {
    user = {
      id: userInfo._id,
      username: userInfo.username,
      muted: false,
      banned: false,
      role: userInfo.role,
    };
    onlineUsers.push(user);
  }
  return user;
};

export const removeOnlineUser = (id: string): User | undefined => {
  const index = onlineUsers.findIndex((user) => user.id === id);
  if (index !== -1) return onlineUsers.splice(index, 1)[0];
};

export const getOnlineUser = (id: string): User | undefined =>
  onlineUsers.find((user) => user.id === id);

export const getOnlineUsers = (): User[] => onlineUsers;

export const getOfflineUsers = async () => {
  const test = await User.find({ _id: { $nin: onlineUsers.map((user) => user.id) } });
  console.log("test", test);
  return test;
};

export const muteUser = async (id: string) => {
  await User.findByIdAndUpdate(id, { muted: true });
  const user = getOnlineUser(id);
  if (user) {
    user.muted = true;
  }
};
