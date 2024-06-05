import { FC, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useSocket } from "../../hook/useSocket";
import { IUser, UserRole } from "../../types/user";
import UserItem from "./UserItem";
import UserList from "./UserList";

interface Props {}

interface Users {
  onlineUsers: IUser[];
  offlineUsers: IUser[];
}

const UserPanel: FC<Props> = () => {
  const [users, setUsers] = useState<Users>({ offlineUsers: [], onlineUsers: [] });

  const { user: currentUser } = useContext(AuthContext);
  const { on } = useSocket();

  const [searchQuery, setSearchQuery] = useState("");

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
    <aside className="bg-gray-200 rounded-lg p-4 overflow-auto max-h-full w-full basis-1/3 h-[calc(100%_-50px)]">
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
