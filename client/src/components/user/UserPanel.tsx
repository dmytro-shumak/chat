import { FC, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { IUser, UserRole } from "../../types/user";
import UserItem from "./UserItem";
import UserList from "./UserList";

interface Props {
  onlineUsers: IUser[];
}

const UserPanel: FC<Props> = ({ onlineUsers }) => {
  const { user: currentUser } = useContext(AuthContext);
  if (!currentUser) return null;

  const isCurrentUserAdmin = currentUser.role === UserRole.Admin;

  return (
    <aside className="bg-gray-200 rounded-lg p-4 overflow-auto max-h-full w-full basis-1/3">
      <div>
        <div className="flex items-center">
          <UserItem user={currentUser} shouldShowUserActions={false} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="mt-4 px-2 py-1 border border-gray-300 rounded w-full"
        />
      </div>
      <UserList users={onlineUsers} />
      {isCurrentUserAdmin && <UserList users={[]} />}
    </aside>
  );
};

export default UserPanel;
