import { FC } from "react";
import { IUser } from "../../types/user";
import UserItem from "./UserItem";

interface Props {
  users: IUser[];
}

const UserList: FC<Props> = ({ users }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Online Users &#40;{users.length}&#41;</h3>
      <div className="mt-2 gap-2 flex flex-col">
        {users.map((user) => (
          <UserItem user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
