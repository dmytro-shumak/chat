import { FC } from "react";
import logoutIcon from "../../assets/icons/logout-icon.svg";
import muteIcon from "../../assets/icons/mute-icon.svg";
import unmuteIcon from "../../assets/icons/unmute-icon.svg";
import { useAuth } from "../../context/auth/useAuth";
import { useSocket } from "../../context/socket/useSocket";
import { IUser, UserRole } from "../../types/user";
import { classNames } from "../../utils/classNames";
import { getUserAvatar } from "../../utils/getUserAvatar";
import BanIcon from "../icons/BanIcon";

interface Props {
  user: IUser;
  showLogoutIcon?: boolean;
}

const UserItem: FC<Props> = ({ user, showLogoutIcon }) => {
  const { emit } = useSocket();
  const { user: currentUser, disconnectUser } = useAuth();
  const isCurrentUserAdmin = currentUser?.role === UserRole.Admin;

  const isUserAdmin = user.role === UserRole.Admin;

  const handleMuteUser = () => {
    emit("muteUser", user._id);
  };

  const handleBanUser = () => {
    emit("banUser", user._id);
  };

  const handleLogout = () => {
    disconnectUser(true);
  };

  return (
    <div className="flex items-center w-full">
      <img
        src={getUserAvatar(user.username)}
        alt={`${currentUser?.username} avatar`}
        className="w-10 h-10 rounded-full"
      />
      <span className="ml-2 truncate">{user.username}</span>
      {isUserAdmin && <span className="ml-2 text-sm text-gray-500">admin</span>}
      {isCurrentUserAdmin && !isUserAdmin && (
        <>
          <div className="min-w-5 w-5 h-5 ml-auto mr-2 cursor-pointer" onClick={handleMuteUser}>
            {user.isMuted ? (
              <img src={muteIcon} alt="Mute Icon" />
            ) : (
              <img src={unmuteIcon} alt="Unmute Icon" />
            )}
          </div>
          <BanIcon
            className={classNames(
              "min-w-5 w-5 h-5 cursor-pointer",
              user.isBanned ? "fill-red-700" : "fill-inherit"
            )}
            onClick={handleBanUser}
          />
        </>
      )}
      {showLogoutIcon && (
        <div className="w-5 h-5 ml-auto mr-2 cursor-pointer" onClick={handleLogout}>
          <img src={logoutIcon} alt="Mute Icon" />
        </div>
      )}
    </div>
  );
};

export default UserItem;
