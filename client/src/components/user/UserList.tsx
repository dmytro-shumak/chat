import { FC } from "react";
import { IUser } from "../../types/user";
import UserItem from "./UserItem";

interface Props {
  users: IUser[];
  title: string;
}

const UserList: FC<Props> = ({ users, title }) => {
  return (
    <div className="mt-4 overflow-auto">
      <h3 className="text-lg font-semibold">
        {title} &#40;{users.length}&#41;
      </h3>
      <div className="mt-2 gap-2 flex flex-col">
        {users.map((user) => (
          <UserItem user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
