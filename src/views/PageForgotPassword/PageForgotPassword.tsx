import React, { BaseSyntheticEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import ButtonCustom from "../../components/ButtonCustom";
import Input from "../../components/Input";
import { HEALTH_PROFS } from "../../constant";
import { LINK_PAGE_LOGIN_REG } from "../../routes";
import PasswordRecoveryService from "../../services/PasswordRecoveryService";
import { validatePostRequest } from "../../utils/commonUtils";

const PageForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [formForgotPassData, setFormForgotPassData] = useState({
    email: "",
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ className: "text-danger" })
  );
  const [_, forceUpdate] = useState<any>();

  /*---------------Event Handlers----------------*/

  const onSubmitForgotPassForm = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate("");
      return;
    }

    const jsonPayload = {
      Email: formForgotPassData.email,
      Website: HEALTH_PROFS.WEBSITE,
    };

    try {
      const res = await PasswordRecoveryService.createRecoverRequest(
        jsonPayload
      );
      if (validatePostRequest(res)) {
        navigate(LINK_PAGE_LOGIN_REG);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="page-margin  w-full">
      <section className="px-10 py-5 flex flex-col items-start justify-center gap-5 screen_var_one:px-0">
        <div className="w-full flex flex-col gap-5 text-sm text-left">
          <h4 className="font-semibold text-2xl text-primary-pLabel">
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
              onBlur={() => {
                simpleValidator.current.showMessageFor("email");
              }}
              validationMessage={simpleValidator.current.message(
                "email",
                formForgotPassData.email,
                "required|email"
              )}
            />
          </div>

          <div className="px-2">
            <ButtonCustom
              className="w-full px-2 py-1 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-lightTeal hover:bg-primary-bg-interactiveBlueHover"
              label={"Submit"}
              handleClickWithLoader={onSubmitForgotPassForm}
            />
          </div>

          <div className="px-2">
            <div className="w-full h-8 px-2 flex gap-2 justify-center bg-primary-light-100 border border-primary-light-900 rounded-full leading-8">
              <span>or</span>
              <Link to={LINK_PAGE_LOGIN_REG}>
                <span className="mx-1 text-primary-link-500">Login</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageForgotPassword;
