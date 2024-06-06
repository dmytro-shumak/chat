import { FC } from "react";
import { classNames } from "../../utils/classNames";

interface Props {
  isVisible: boolean;
  handleVisibility: () => void;
}

const Burger: FC<Props> = ({ handleVisibility, isVisible }) => {
  return (
    <button className="space-y-2 ml-auto lg:hidden" onClick={handleVisibility}>
      <span
        className={classNames(
          "block w-8 h-0.5 bg-black transform transition duration-500",
          isVisible && "rotate-45 translate-y-2.5"
        )}
      ></span>
      <span
        className={classNames(
          "block w-8 h-0.5 bg-black transition duration-500",
          isVisible && "opacity-0"
        )}
      ></span>
      <span
        className={classNames(
          "block w-8 h-0.5 bg-black transform transition duration-500",
          isVisible && "-rotate-45 -translate-y-2.5"
        )}
      ></span>
    </button>
  );
};

export default Burger;
