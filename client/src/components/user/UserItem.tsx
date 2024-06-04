import { FC } from "react";
import { IUser, UserRole } from "../../types/user";

interface Props {
  user: IUser;
  isCurrentUserAdmin: boolean;
}

const UserItem: FC<Props> = ({ user, isCurrentUserAdmin }) => {
  const isUserAdmin = user.role === UserRole.Admin;
  console.log("user", user);
  return (
    <div className="flex items-center">
      <img
        src="https://gravatar.com/avatar/e30c2abedbceb2d4179e29273ef50eb3?size=256&cache=1717484638117"
        alt="User Avatar"
        className="w-10 h-10 rounded-full"
      />
      <span className="ml-2">{user.username}</span>
      {isUserAdmin && <span className="ml-2 text-sm text-gray-500">admin</span>}
      {isCurrentUserAdmin && (
        <>
          <div className="ml-auto mr-2">mute</div>
          <div>ban</div>
        </>
      )}
    </div>
  );
};

export default UserItem;
