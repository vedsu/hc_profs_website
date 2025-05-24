import { InputTextarea } from "primereact/inputtextarea";
import React, { BaseSyntheticEvent, ReactNode, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import ButtonCustom from "../../components/ButtonCustom";
import DialogCustom from "../../components/DialogCustom";
import Input from "../../components/Input";
import ContactUsService from "../../services/ContactUsService";
import { validatePostRequest } from "../../utils/commonUtils";

const initialContactUsFormData = {
  name: "",
  email: "",
  message: "",
};

const PageContactUs: React.FC = () => {
  const [showContactFormDialog, setShowContactFormDialog] = useState(false);
  const [formContactUsData, setFormContactUsData] = useState(
    initialContactUsFormData
  );
  const [showContactUsPopUp, setShowContactUsPopUp] = useState({
    isSuccess: false,
    showPopUp: false,
    headerContent: <div />,
    bodyContent: <div />,
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ className: "text-danger" })
  );
  const [_, forceUpdate] = useState<any>();

  const handleContactUsFormChange = (e: BaseSyntheticEvent) => {
    setFormContactUsData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onSubmitContactUsForm = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate("");
      return;
    }

    const payload = {
      name: formContactUsData.name,
      email: formContactUsData.email,
      message: formContactUsData.message,
    };

    try {
      const response = await ContactUsService.contactUs(payload);

      if (validatePostRequest(response)) {
        setShowContactUsPopUp({
          isSuccess: true,
          showPopUp: true,
          headerContent: <h1 className="text-2xl" />,
          bodyContent: (
            <div className="p-5">
              <p>{response?.data?.Message}.</p>
            </div>
          ),
        });
        setShowContactFormDialog(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*---------------------Sectional Renders--------------------------*/

  const renderContactUsForm = (): ReactNode => {
    const { name, email, message } = formContactUsData;
    return (
      <div className="pt-5 flex flex-col gap-5">
        <div className="px-2">
          <Input
            className=""
            name={"name"}
            label={"Name"}
            type={"text"}
            value={name}
            handler={handleContactUsFormChange}
            mandatory
            onBlur={() => {
              simpleValidator.current.showMessageFor("name");
            }}
            validationMessage={simpleValidator.current.message(
              "name",
              name,
              "required"
            )}
          />
        </div>
        <div className="px-2">
          <Input
            className=""
            name={"email"}
            label={"Email"}
            type={"email"}
            value={email}
            handler={handleContactUsFormChange}
            mandatory
            onBlur={() => {
              simpleValidator.current.showMessageFor("email");
            }}
            validationMessage={simpleValidator.current.message(
              "email",
              email,
              "required|email"
            )}
          />
        </div>

        <div className="px-2 flex flex-col gap-1">
          <label>{"Message"}</label>
          <InputTextarea
            className={"w-full min-h-40 p-2 border border-primary-light-900"}
            name="message"
            value={message}
            onChange={handleContactUsFormChange}
            maxLength={5000}
          />
        </div>

        <div className="w-full self-center">
          <ButtonCustom
            className="w-full px-2 py-1 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-interactiveBlueHover"
            label={"Submit"}
            handleClickWithLoader={onSubmitContactUsForm}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page-margin w-full">
      <section className="px-10 py-5 flex flex-col items-center justify-center screen_var_one:px-0">
        <div className="flex flex-col gap-5">
          <div className="mb-1 w-full text-left">
            <h4 className="font-semibold text-2xl text-primary-pLabel">
              How can we help you?
            </h4>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-normal leading-6">
                <span className="text-base font-semibold">Please Note:</span>
                <br />
                <span>
                  Feel free to reach out to us during working hours. Our team
                  will be happy to assist you! We are open Monday through Friday
                  (except on major US holidays) from 10 AM to 7 PM EST. Our
                  response time for most queries is within 24 Hours. Visit our
                  website to complete the details and become a part of our
                  dynamic force shaping the future of healthcare.
                </span>
                <br />
              </p>
            </div>

            <div className="flex flex-col gap-2 p-5">
              <div>We are here to assist you</div>
              <div className="flex flex-col items-stretch gap-5 screen_var_one:flex-row  screen_var_one:gap-20 text-base font-normal leading-8">
                <div className="w-full border border-primary-light-900 p-5 rounded-lg bg-primary-light-100">
                  <p className="text-primary-pLabel">Call Us</p>
                  <p className="text-sm">+1-830-256-0384</p>
                  <p className="text-primary-pLabel">Email Us</p>
                  <p className="text-sm">cs@hcprofs.com</p>
                </div>

                <div className="w-full border border-primary-light-900 p-5 rounded-lg bg-primary-light-100">
                  <p className="text-primary-pLabel">
                    Address:
                    <br />
                    HC Profs <br />
                    2438 Industrial Blvd #802 <br />
                    Abilene
                    <br /> TX 79605
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-64 self-center">
              <button
                className="w-full px-2 py-1 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-interactiveBlueHover"
                onClick={() => setShowContactFormDialog(true)}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <DialogCustom
        dialogVisible={showContactFormDialog}
        containerClassName={
          "w-full screen_var_one:min-w-[500px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={<h1 className="text-2xl">Contact Us</h1>}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={renderContactUsForm()}
        onHideDialog={() => {
          if (!showContactFormDialog) return;
          setShowContactFormDialog(false);
        }}
      />

      <DialogCustom
        dialogVisible={showContactUsPopUp.showPopUp}
        containerClassName={
          "max-w-[500px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={showContactUsPopUp.headerContent}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={showContactUsPopUp.bodyContent}
        onHideDialog={() => {
          setShowContactUsPopUp((prev) => ({ ...prev, showPopUp: false }));
        }}
      />
    </div>
  );
};

export default PageContactUs;
