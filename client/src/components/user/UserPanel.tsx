import { FC, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useSocket } from "../../hook/useSocket";
import { IUser, UserRole } from "../../types/user";
import { classNames } from "../../utils/classNames";
import UserItem from "./UserItem";
import UserList from "./UserList";

interface Props {
  isChatVisible: boolean;
  hasInteractedWithBurger: boolean;
}

interface Users {
  onlineUsers: IUser[];
  offlineUsers: IUser[];
}

const UserPanel: FC<Props> = ({ isChatVisible, hasInteractedWithBurger }) => {
  const [users, setUsers] = useState<Users>({ offlineUsers: [], onlineUsers: [] });
  const [searchQuery, setSearchQuery] = useState("");

  const { user: currentUser } = useContext(AuthContext);
  const { on } = useSocket();

  const filteredOnlineUsers = useMemo(
    () =>
      users.onlineUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users.onlineUsers, searchQuery]
  );

  const filteredOfflineUsers = useMemo(
    () =>
      users.offlineUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [users.offlineUsers, searchQuery]
  );

  useEffect(() => {
    on("userList", (users: Users) => {
      setUsers(users);
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
        "bg-slate-300 rounded-lg fixed lg:static p-4 overflow-auto max-w-[500px] lg:max-h-full w-full basis-1/3 h-[calc(100%_-50px)] shadow-primary translate-x-full lg:translate-x-0 right-0",
        isChatVisible && "animate-slideIn",
        // Don't show animation until user interacts with hamburger
        !isChatVisible && hasInteractedWithBurger && "animate-slideOut lg:animate-none"
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
