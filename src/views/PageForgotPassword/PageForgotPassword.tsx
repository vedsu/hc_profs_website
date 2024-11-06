import jsonToFormData from "json-form-data";
import React, { BaseSyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import Input from "../../components/Input";
import { FORM_DATA_OPTIONS, HEALTH_PROFS } from "../../constant";
import { LINK_PAGE_LOGIN_REG } from "../../routes";
import PasswordRecoveryService from "../../services/PasswordRecoveryService";
import { validatePostRequest } from "../../utils/commonUtils";

const PageForgotPassword: React.FC = () => {
  const [formForgotPassData, setFormForgotPassData] = useState({
    email: "",
  });

  /*---------------Event Handlers----------------*/

  const onSubmitForgotPassForm = async () => {
    const jsonPayload = {
      Email: formForgotPassData.email,
      Website: HEALTH_PROFS.WEBSITE,
    };
    const formDataPayload = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

    try {
      const res = await PasswordRecoveryService.createRecoverRequest(
        formDataPayload
      );
      if (validatePostRequest(res)) {
        setFormForgotPassData({ email: "" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-margin ">
      <section className="py-5 flex flex-col items-center justify-center gap-5">
        <div className="w-full flex flex-col text-sm text-left">
          <h4 className="font-semibold text-2xl text-primary-pTextTeal ">
            Forgot Password
          </h4>
          <div>
            <p>
              Please provide your registered email.
              <br />
              We'll email you a link so you can receive your password.
            </p>
          </div>
        </div>

        <div className="py-5 flex flex-col gap-5">
          <div className="px-2">
            <Input
              className="w-72 h-8"
              name={"email"}
              placeholder="Enter your email"
              label={"Email"}
              type={"email"}
              value={formForgotPassData.email}
              handler={(e: BaseSyntheticEvent) =>
                setFormForgotPassData({ email: e.target.value })
              }
              mandatory
            />
            {/* <small></small> */}
          </div>

          <div className="px-2">
            <ButtonCustom
              className="w-full h-8 px-2 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-teal border border-primary-light-900 hover:bg-primary-bg-lightTeal rounded-full"
              label={"Submit"}
              handleClickWithLoader={onSubmitForgotPassForm}
            />
          </div>

          <div className="px-2">
            <div className="w-full h-8 px-2 flex gap-2 justify-center bg-primary-bg-mintCream border border-primary-light-900 rounded-full leading-8">
              <span>or</span>
              <Link to={LINK_PAGE_LOGIN_REG}>
                <span className="mx-1 text-primary-bg-teal">Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageForgotPassword;
