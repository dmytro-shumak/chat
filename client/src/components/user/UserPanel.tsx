import { FC, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { IUser, UserRole } from "../../types/user";
import UserItem from "./UserItem";
import UserList from "./UserList";

interface Props {
  onlineUsers: IUser[];
  offlineUsers: IUser[];
}

const UserPanel: FC<Props> = ({ onlineUsers, offlineUsers }) => {
  const { user: currentUser } = useContext(AuthContext);
  if (!currentUser) return null;

  const isCurrentUserAdmin = currentUser.role === UserRole.Admin;

  return (
    <aside className="bg-gray-200 rounded-lg p-4 overflow-auto max-h-full w-full basis-1/3 h-[calc(100%_-50px)]">
      <div>
        <div className="flex items-center">
          <UserItem user={currentUser} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="mt-4 px-2 py-1 border border-gray-300 rounded w-full"
        />
      </div>
      <UserList users={onlineUsers} title="Online users" />
      {isCurrentUserAdmin && <UserList users={offlineUsers} title="Offline users" />}
    </aside>
  );
};

export default UserPanel;
