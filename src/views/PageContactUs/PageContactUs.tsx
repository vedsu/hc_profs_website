import { InputTextarea } from "primereact/inputtextarea";
import React, { BaseSyntheticEvent, ReactNode, useState } from "react";
import ButtonCustom from "../../components/ButtonCustom";
import DialogCustom from "../../components/DialogCustom";
import Input from "../../components/Input";
import ContactUsService from "../../services/ContactUsService";

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

  const handleContactUsFormChange = (e: BaseSyntheticEvent) => {
    setFormContactUsData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onSubmitContactUsForm = async () => {
    const payload = {
      name: formContactUsData.name,
      email: formContactUsData.email,
      message: formContactUsData.message,
    };

    try {
      await ContactUsService.contactUs(payload);
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
          />
          {/* <small></small> */}
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
          />
          {/* <small></small> */}
        </div>
        <div className="px-2 flex flex-col gap-1">
          <label>
            {"Message"}
            <span className="text-primary-asterisk">*</span>
          </label>
          <InputTextarea
            className={"w-full min-h-40 p-2 border border-primary-light-900"}
            name="message"
            value={message}
            onChange={handleContactUsFormChange}
            maxLength={5000}
          />
          {/* <small>{"validationMessage"}</small> */}
        </div>

        <div className="self-center">
          <ButtonCustom
            className="w-32 h-8 px-2 flex gap-2 justify-center text-white bg-primary-bg-limedSpruce border border-primary-light-900 rounded-full hover:bg-primary-dark-100"
            label={"Submit"}
            handleClickWithLoader={onSubmitContactUsForm}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="page-margin w-full ">
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

            <div>
              <button
                className="px-5 w-full h-8 border border-primary-light-900 rounded-full bg-primary-bg-limedSpruce text-white hover:bg-primary-dark-100 sm:max-w-fit"
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
          "max-w-[668px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={<h1 className="text-2xl">Contact Us</h1>}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={renderContactUsForm()}
        onHideDialog={() => {
          if (!showContactFormDialog) return;
          setShowContactFormDialog(false);
        }}
      />
    </div>
  );
};

export default PageContactUs;
