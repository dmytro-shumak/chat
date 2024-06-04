import { FC, useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { IUser, UserRole } from "../../types/user";
import UserItem from "./UserItem";

interface Props {
  onlineUsers: IUser[];
}

const UserPanel: FC<Props> = ({ onlineUsers }) => {
  const { user: currentUser } = useContext(AuthContext);
  if (!currentUser) return null;

  const isCurrentUserAdmin = currentUser.role === UserRole.Admin;

  return (
    <aside className="bg-gray-200 rounded-lg p-4 overflow-auto max-h-full w-full basis-1/3">
      <div className="user-info">
        <div className="flex items-center">
          <UserItem user={currentUser} isCurrentUserAdmin={isCurrentUserAdmin} />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="mt-4 px-2 py-1 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="online-users mt-4">
        <h3 className="text-lg font-semibold">Online Users &#40;{onlineUsers.length}&#41;</h3>
        <div className="mt-2 gap-2 flex flex-col">
          {onlineUsers.map((user) => (
            <UserItem user={user} isCurrentUserAdmin={isCurrentUserAdmin} />
          ))}
        </div>
      </div>
      {isCurrentUserAdmin && (
        <div className="offline-users mt-4">
          <h3 className="text-lg font-semibold">Offline Users</h3>
          <div className="mt-2 gap-2 flex flex-col">
            {[].map((user) => (
              <UserItem user={user} isCurrentUserAdmin={isCurrentUserAdmin} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default UserPanel;
