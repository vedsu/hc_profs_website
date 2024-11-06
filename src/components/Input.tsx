import { InputText, InputTextProps } from "primereact/inputtext";

export interface IInputProps extends InputTextProps {
  id?: string;
  className?: string;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: any;
  handler: any;
  validationMessage?: string;
  disabled?: boolean;
  mandatory?: boolean;
}

const Input = (props: IInputProps) => {
  const {
    id,
    className,
    name,
    label,
    placeholder,
    type,
    value,
    handler,
    validationMessage,
    mandatory,
    disabled,
  } = props;

  return (
    <div className="mb-2 grid gap-1 relative">
      <label htmlFor={id}>
        {label}
        <span className="text-primary-asterisk">{mandatory ? "*" : ""}</span>
      </label>
      <InputText
        id={id}
        name={name}
        placeholder={placeholder}
        className={`app-input h-8 p-2 border border-primary-light-900 outline-none text-sm text-primary-pText ${
          className ?? ""
        }`}
        type={type ?? "text"}
        value={value}
        onChange={handler}
        disabled={disabled}
      />
      <small>{validationMessage}</small>
    </div>
  );
};

export default Input;
