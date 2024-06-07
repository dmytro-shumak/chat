import { ChangeEvent, FC, InputHTMLAttributes } from "react";
import { classNames } from "../../utils/classNames";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  placeholder?: string;
  type?: string;
  id: string;
  value?: string;
  handleValueChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormField: FC<Props> = ({
  id,
  placeholder,
  type = "text",
  name = id,
  className,
  value,
  handleValueChange,
  ...otherProps
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        Username
      </label>
      <input
        className={classNames(
          "shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-outline",
          className
        )}
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleValueChange}
        {...otherProps}
      />
    </div>
  );
};

export default FormField;
