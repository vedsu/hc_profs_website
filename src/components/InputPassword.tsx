import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { IInputProps } from "./Input";

interface IInputPassword extends IInputProps {}

const InputPasswordCustom = (props: IInputPassword) => {
  const [mask, setMask] = useState(true);
  const {
    id,
    name,
    label,
    placeholder,
    value,
    handler,
    validationMessage,
    disabled,
  } = props;

  const onTogglePasswordMask = () => {
    setMask((prev) => !prev);
  };

  return (
    <div className="mb-2 grid gap-1 relative">
      {label ? <label htmlFor={id}>{label}</label> : <></>}
      <div className="flex justify-between items-center relative">
        <InputText
          id={id}
          name={name}
          placeholder={placeholder}
          className="app-input w-full h-8 p-2 pr-8 border border-primary-light-900 outline-none text-sm text-primary-pText"
          type={mask ? "password" : "text"}
          value={value}
          onChange={handler}
          disabled={disabled}
        />
        <button
          type="button"
          className="absolute top-[5px] right-3"
          onClick={onTogglePasswordMask}
        >
          {mask ? (
            <i className="i-focus pi pi-eye-slash text-secondary-sText"></i>
          ) : (
            <i className="i-focus pi pi-eye text-secondary-sText"></i>
          )}
        </button>
      </div>
      <div className="text-red-500 text-xs">
        {validationMessage ? validationMessage : null}
      </div>
    </div>
  );
};

export default InputPasswordCustom;
