import { ButtonHTMLAttributes, FC } from "react";
import { classNames } from "../../utils/classNames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ ...props }) => {
  return (
    <button
      {...props}
      className={classNames(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold focus:shadow-outline px-4 py-2 rounded block disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70",
        props.className
      )}
    ></button>
  );
};

export default Button;
