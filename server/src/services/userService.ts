import User, { IUser } from "../model/User";

interface OnlineUser {
  _id?: IUser["_id"];
  username: string;
  role: string;
  isMuted: boolean;
  isBanned: boolean;
}

const onlineUsers: OnlineUser[] = [];

export const addOnlineUser = async (userInfo: IUser): Promise<OnlineUser> => {
  let user: OnlineUser | undefined | null = onlineUsers.find((u) => u._id === userInfo._id);
  if (!user) {
    user = await User.findById(userInfo._id);
    if (!user) throw new Error("User not found");

    onlineUsers.push(user);
  }
  return user;
};

export const removeOnlineUser = (id: IUser["_id"]): OnlineUser | undefined => {
  const index = onlineUsers.findIndex((user) => user._id === id);
  if (index !== -1) return onlineUsers.splice(index, 1)[0];
};

export const getOnlineUser = (id: string): OnlineUser | undefined =>
  onlineUsers.find((user) => user._id === id);

export const getOnlineUsers = (): OnlineUser[] => onlineUsers;

export const getOfflineUsers = async () => {
  const offlineUsers = await User.find({ _id: { $nin: onlineUsers.map((user) => user._id) } });
  return offlineUsers;
};

export const muteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const updatedUser = await User.findByIdAndUpdate(id, { isMuted: !user.isMuted }, { new: true });
  const onlineUser = getOnlineUser(id);
  if (onlineUser) {
    onlineUser.isMuted = !onlineUser.isMuted;
  }
};
