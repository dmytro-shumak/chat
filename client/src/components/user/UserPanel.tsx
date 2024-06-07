import { FC, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/auth/useAuth";
import { useSocket } from "../../context/socket/useSocket";
import { IUser, UserRole } from "../../types/user";
import { classNames } from "../../utils/classNames";
import UserItem from "./UserItem";
import UserList from "./UserList";

interface Props {
  isChatVisible: boolean;
  hasInteractedWithBurger: boolean;
}

const UserPanel: FC<Props> = ({ isChatVisible, hasInteractedWithBurger }) => {
  const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);
  const [offlineUsers, setOfflineUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { user: currentUser } = useAuth();
  const { on } = useSocket();

  const filteredOnlineUsers = useMemo(
    () =>
      onlineUsers.filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase())),
    [onlineUsers, searchQuery]
  );

  const filteredOfflineUsers = useMemo(
    () =>
      offlineUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [offlineUsers, searchQuery]
  );

  useEffect(() => {
    on("onlineUserList", (onlineUsers: IUser[]) => {
      setOnlineUsers(onlineUsers);
    });
    on("offlineUserList", (offlineUsers: IUser[]) => {
      setOfflineUsers(offlineUsers);
    });
  }, [on]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (!currentUser) {
    return null;
  }

  const isCurrentUserAdmin = currentUser.role === UserRole.Admin;

  return (
    <aside
      className={classNames(
        "bg-slate-300 rounded-lg fixed lg:static p-4 overflow-auto max-w-[500px] lg:max-h-full w-full basis-1/3 h-[calc(100%_-50px)] shadow-primary translate-x-full lg:translate-x-0 right-0 lg:animate-none",
        isChatVisible && "animate-slideIn",
        // Don't show animation until user interacts with hamburger
        !isChatVisible && hasInteractedWithBurger && "animate-slideOut"
      )}
    >
      <div>
        <div className="flex items-center">
          <UserItem user={currentUser} showLogoutIcon />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="mt-4 px-2 py-1 border border-gray-300 rounded w-full"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
      <UserList users={filteredOnlineUsers} title="Online users" />
      {isCurrentUserAdmin && <UserList users={filteredOfflineUsers} title="Offline users" />}
    </aside>
  );
};

export default UserPanel;
