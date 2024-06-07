import User, { IUser } from "../model/User";
import { UserServer } from "../types/socket";

export const getOnlineUser = (id: string, io: UserServer) => {
  for (let [_, value] of io.sockets.sockets) {
    if (String(value.data.user._id) === id) {
      return value.data.user;
    }
  }
};
const getOnlineUsers = (io: UserServer): IUser[] => {
  const users: IUser[] = [];
  io.sockets.sockets.forEach((value) => {
    users.push(value.data.user);
  });
  return users;
};

const getOfflineUsers = async (io: UserServer) => {
  const onlineUserIds = getOnlineUsers(io).map((user) => user._id);
  const offlineUsers = await User.find({ _id: { $nin: onlineUserIds } });

  return offlineUsers;
};

export const muteUser = async (id: string, io: UserServer): Promise<IUser | undefined> => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(id, { isMuted: !user.isMuted });
  if (!updatedUser) {
    throw new Error("User not found");
  }

  const onlineUser = getOnlineUser(id, io);
  if (onlineUser) {
    onlineUser.isMuted = !updatedUser.isMuted;
  }

  return onlineUser;
};

export const banUser = async (id: string, io: UserServer): Promise<IUser | undefined> => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const updatedUser = await User.findByIdAndUpdate(id, { isBanned: !user.isBanned });
  if (!updatedUser) {
    throw new Error("User not found");
  }

  const onlineUser = getOnlineUser(id, io);
  if (onlineUser) {
    onlineUser.isBanned = !updatedUser.isBanned;
  }

  return onlineUser;
};

async function sendOfflineUsersToAdmins(io: UserServer) {
  const offlineUsers = await getOfflineUsers(io);
  io.sockets.sockets.forEach((socket: any) => {
    if (socket.data.user.role === "admin") {
      socket.emit("offlineUserList", offlineUsers);
    }
  });
}

export async function updateUserList(io: UserServer) {
  const onlineUsers = getOnlineUsers(io);
  await sendOfflineUsersToAdmins(io);
  io.emit("onlineUserList", onlineUsers);
}
