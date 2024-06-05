import User, { IUser } from "../model/User";
import { UserServer } from "../types/socket";

export const getOnlineUser = (id: string, io: UserServer): any => {
  for (let [_, value] of io.sockets.sockets) {
    if (String(value.data.user._id) === id) {
      return value.data.user;
    }
  }
};

export const getOnlineUsers = (io: UserServer): IUser[] => {
  const users: IUser[] = [];
  io.sockets.sockets.forEach((value) => {
    users.push(value.data.user);
  });
  return users;
};

export const getOfflineUsers = async (io: UserServer) => {
  const onlineUserIds = getOnlineUsers(io).map((user) => user._id);
  const offlineUsers = await User.find({ _id: { $nin: onlineUserIds } });

  return offlineUsers;
};

export const muteUser = async (id: string, io: UserServer) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  await User.findByIdAndUpdate(id, { isMuted: !user.isMuted });

  const onlineUser = getOnlineUser(id, io);
  if (onlineUser) {
    onlineUser.isMuted = !onlineUser.isMuted;
  }
};

export const banUser = async (id: string, io: UserServer) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  await User.findByIdAndUpdate(id, { isBanned: !user.isBanned });

  const onlineUser = getOnlineUser(id, io);
  if (onlineUser) {
    onlineUser.isBanned = !onlineUser.isBanned;
  }
};
