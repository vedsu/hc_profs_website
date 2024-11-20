import { Button, ButtonProps } from "primereact/button";
import { useState } from "react";

interface IButtonProps extends ButtonProps {
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  loaderIconClassName?: string;
  label: string;
  type?: any;
  isLoading?: boolean;
  handleClick?: any;
  handleClickWithLoader?: any;
  callbackSuccess?: any;
}

const ButtonCustom = (props: IButtonProps) => {
  const {
    className,
    containerClassName,
    labelClassName,
    loaderIconClassName,
    label,
    isLoading,
    type,
    handleClick,
    handleClickWithLoader,
    callbackSuccess,
    ...nativeProps
  } = props;

  const [showLoader, setShowLoader] = useState(false);

  const onClickCustomHandler = () => {
    if (handleClickWithLoader) {
      setShowLoader(true);
      handleClickWithLoader().then(() => {
        setShowLoader(false);
        if (callbackSuccess) {
          callbackSuccess();
        }
      });
    } else if (handleClick) {
      handleClick();
    }
  };

  return (
    <div
      className={`flex items-center justify-between ${
        containerClassName ?? ""
      }`}
    >
      <Button
        className={`btn-custom block text-base ${className ?? ""} relative`}
        onClick={onClickCustomHandler}
        // autoFocus
        type={type}
        {...nativeProps}
      >
        <span className={`${labelClassName ?? ""}`}>{label}</span>

        {showLoader || isLoading ? (
          <i
            className={`mx-2 i-focus pi pi-spin pi-spinner text-xs ${
              loaderIconClassName ?? ""
            }`}
          ></i>
        ) : (
          <>{props?.children}</>
        )}
      </Button>
    </div>
  );
};

export default ButtonCustom;
