import { Dialog } from "primereact/dialog";
import { ReactNode } from "react";

interface IDialogCustomProps {
  dialogVisible: boolean;
  headerTemplate: ReactNode;
  footerTemplate?: ReactNode;
  bodyTemplate: ReactNode;
  containerClassName?: string;
  headerTemplateClassName?: string;
  footerTemplateClassName?: string;
  onHideDialog: () => void;
  position?: any;
}

const DialogCustom = (props: IDialogCustomProps) => {
  const {
    dialogVisible,
    headerTemplate,
    bodyTemplate,
    footerTemplate,
    containerClassName,
    headerTemplateClassName,
    footerTemplateClassName,
    onHideDialog,
    position,
  } = props;

  const headerElement = (
    <div
      className={`flex items-center justify-center gap-2 ${
        headerTemplateClassName ?? ""
      }`}
    >
      {headerTemplate}
    </div>
  );

  const footerContent = (
    <div className={`${footerTemplateClassName ?? ""}`}>{footerTemplate}</div>
  );

  return (
    <Dialog
      className={containerClassName ?? ""}
      visible={dialogVisible}
      modal
      header={headerElement}
      footer={footerContent}
      style={{ width: "50rem" }}
      onHide={onHideDialog}
      position={position ? position : "center"}
      resizable={false}
      closeOnEscape={true}
      draggable={false}
    >
      {bodyTemplate}
    </Dialog>
  );
};

export default DialogCustom;
