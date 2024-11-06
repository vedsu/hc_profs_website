interface IRadioCustomProps {
  className?: string;
  label: string;
  id: string;
  name: string;
  value: string;
  handler: any;
  checked: boolean;
}

const RadioCustom = (props: IRadioCustomProps) => {
  const { className, label, id, name, value, handler, checked } = props;

  return (
    <label htmlFor={id} className="radio-label">
      <input
        className={`radio-input ${className ?? ""}`}
        type="radio"
        name={name}
        id={id}
        value={value}
        onChange={handler}
        checked={checked}
      />
      <span className="custom-radio" />

      {label}
    </label>
  );
};

export default RadioCustom;
