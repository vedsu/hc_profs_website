import jsonToFormData from "json-form-data";
import { BaseSyntheticEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import Input from "../../components/Input";
import InputPasswordCustom from "../../components/InputPassword";
import {
  FORM_DATA_OPTIONS,
  LOCAL_STORAGE_ITEMS,
  USER_ROLE,
} from "../../constant";
import {
  LINK_ATTENDEE_DASHBOARD,
  LINK_PAGE_FORGOT_PASSWORD,
  LINK_SPEAKER_DASHBOARD,
} from "../../routes";
import AuthService from "../../services/AuthService";
import { validatePostRequest } from "../../utils/commonUtils";

const initialRegisterFormData = {
  name: "",
  email: "",
  password: "",
  contact: "",
  registrationRole: "",
  role: {
    speaker: false,
    attendee: false,
  },
};

const initialLoginFormData = {
  email: "",
  password: "",
  role: {
    speaker: false,
    attendee: false,
  },
};

const PageLoginOrRegister = () => {
  const navigate = useNavigate();

  const [loginFormData, setLoginFormData] = useState(initialLoginFormData);
  const [registerFormData, setRegisterFormData] = useState(
    initialRegisterFormData
  );
  const [activeTabId, setActiveTabId] = useState("login-tab");

  /*----------------------------------------Event Handlers----------------------------------------*/

  const handleLoginFormInputChange = (e: BaseSyntheticEvent) => {
    if (e.target.type === "checkbox") {
      setLoginFormData((prev) => {
        return {
          ...prev,
          role: {
            ...prev.role,
            [e.target.name]: e.target.checked,
          },
        };
      });
      return;
    } else {
      setLoginFormData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const handleRegisterFormInputChange = (e: BaseSyntheticEvent) => {
    if (e.target.type === "checkbox") {
      setRegisterFormData((prev) => {
        return {
          ...prev,
          role: {
            ...prev.role,
            [e.target.name]: e.target.checked,
          },
        };
      });
      return;
    } else {
      setRegisterFormData((prev) => {
        return {
          ...prev,
          [e.target.name]: e.target.value,
        };
      });
    }
  };

  const onLogin = async () => {
    const jsonPayload = prepareLoginPayload();
    const loginDataAsFormData = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

    try {
      const res = await AuthService.login("login", loginDataAsFormData);
      if (validatePostRequest(res)) {
        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.USERINFO,
          JSON.stringify({
            email: loginFormData.email,
            role: loginFormData.role,
          })
        );

        if (loginFormData.role.attendee) navigate(`${LINK_ATTENDEE_DASHBOARD}`);
        else if (loginFormData.role.speaker)
          navigate(`${LINK_SPEAKER_DASHBOARD}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onRegister = async () => {
    const jsonPayload = prepareRegisterPayload();
    const regFormData = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

    try {
      const res = await AuthService.register("register", regFormData);
      if (validatePostRequest(res)) {
        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.USERINFO,
          JSON.stringify({
            name: registerFormData.name,
            email: registerFormData.email,
            role: registerFormData.role,
          })
        );

        if (registerFormData.role.attendee)
          navigate(`${LINK_ATTENDEE_DASHBOARD}`);
        else if (registerFormData.role.speaker)
          navigate(`${LINK_SPEAKER_DASHBOARD}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onTabClick = (event: BaseSyntheticEvent) => {
    setActiveTabId(event.target?.id ?? "");
  };

  /*-----------------------------------------Utils-------------------------------------------------*/

  const prepareLoginPayload = () => {
    let payload = {
      Email: loginFormData.email,
      Password: loginFormData.password,
      UserType: loginFormData.role.attendee
        ? USER_ROLE.ATTENDEE
        : loginFormData.role.speaker
        ? USER_ROLE.SPEAKER
        : "",
    };
    return payload;
  };

  const prepareRegisterPayload = () => {
    let payload = {
      Name: registerFormData.name,
      Email: registerFormData.email,
      Password: registerFormData.password,
      ConfirmPassword: registerFormData.password,
      Contact: registerFormData.contact,
      Role: registerFormData.registrationRole,
      UserType: registerFormData.role.attendee
        ? USER_ROLE.ATTENDEE
        : registerFormData.role.speaker
        ? USER_ROLE.SPEAKER
        : "",
    };
    return payload;
  };

  /*------------------------------- Sectional Renders------------------------------------------------*/

  const renderLoginSection = (): ReactNode => {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="font-bold text-primary-pLabel text-base text-center">
          <h4>{"LOGIN HERE"}</h4>
          {/* <div className="my-1 font-normal text-sm text-primary-pText">
            <p>{"Already have an account ? Login Here"}</p>
          </div> */}
        </div>

        <div className="w-full">
          <Input
            name={"email"}
            placeholder="Email"
            label={""}
            value={loginFormData.email}
            handler={handleLoginFormInputChange}
          />
        </div>
        <div className="w-full">
          <InputPasswordCustom
            name="password"
            placeholder="Password"
            label={""}
            value={loginFormData.password}
            handler={handleLoginFormInputChange}
          />
        </div>

        <div className="w-full flex items-center justify-between text-base">
          <div className="w-[50%]">
            <label htmlFor="checkbox-role-attendee" className="role-label">
              {"Customer"}
              <input
                id="checkbox-role-attendee"
                name="attendee"
                type="checkbox"
                className="user-role-input"
                onChange={handleLoginFormInputChange}
                checked={loginFormData.role.attendee}
                value={USER_ROLE.ATTENDEE}
                disabled={loginFormData.role.speaker}
              />
              <span className="check-mark"></span>
            </label>
          </div>
          <div className="w-[50%]">
            <label htmlFor="checkbox-role-speaker" className="role-label">
              {"Speaker"}
              <input
                id="checkbox-role-speaker"
                name="speaker"
                type="checkbox"
                className="user-role-input"
                onChange={handleLoginFormInputChange}
                checked={loginFormData.role.speaker}
                value={USER_ROLE.SPEAKER}
                disabled={loginFormData.role.attendee}
              />
              <span className="check-mark"></span>
            </label>
          </div>
        </div>

        <div>
          <ButtonCustom
            className={`w-full h-10 px-5 py-2 flex items-center justify-center gap-2 text-secondary-sLabel bg-primary-bg-interactiveBlue font-[600] border rounded-full hover:bg-primary-bg-interactiveBlueHover !text-base`}
            label={"Login"}
            handleClickWithLoader={onLogin}
          />
        </div>

        <div className="text-sm">
          <p>{"Forgot password?"}</p>
          <button
            className="underline"
            onClick={() => navigate(LINK_PAGE_FORGOT_PASSWORD)}
          >
            {"Click here"}
          </button>
        </div>
      </div>
    );
  };

  const renderRegisterSection = (): ReactNode => {
    return (
      <div className="w-full flex flex-col gap-5">
        <div className="font-bold text-center text-primary-pLabel text-base">
          <h4>{"REGISTER HERE"}</h4>
          {/* <div className="my-1 font-normal text-sm text-primary-pText">
            <p>{"Don't have an account ? Register Here"}</p>
          </div> */}
        </div>

        <div className="w-full">
          <Input
            label={""}
            name={"name"}
            placeholder="Name"
            value={registerFormData.name}
            handler={handleRegisterFormInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label={""}
            placeholder="Email"
            name={"email"}
            value={registerFormData.email}
            handler={handleRegisterFormInputChange}
          />
        </div>
        <div className="w-full">
          <InputPasswordCustom
            label={""}
            name={"password"}
            placeholder="Password"
            value={registerFormData.password}
            handler={handleRegisterFormInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label={""}
            placeholder="Contact"
            name={"contact"}
            value={registerFormData.contact}
            handler={handleRegisterFormInputChange}
          />
        </div>
        <div className="w-full">
          <Input
            label={""}
            name={"registrationRole"}
            placeholder="Role"
            value={registerFormData.registrationRole}
            handler={handleRegisterFormInputChange}
          />
        </div>

        <div className="w-full flex items-center justify-between text-base">
          <div className="w-[50%]">
            <label htmlFor="checkbox-role-reg-attendee" className="role-label">
              {"Customer"}
              <input
                id="checkbox-role-reg-attendee"
                name="attendee"
                type="checkbox"
                className="user-role-input"
                onChange={handleRegisterFormInputChange}
                checked={registerFormData.role.attendee}
                value={USER_ROLE.ATTENDEE}
                disabled={registerFormData.role.speaker}
              />
              <span className="check-mark"></span>
            </label>
          </div>
          <div className="w-[50%]">
            <label htmlFor="checkbox-role-reg-speaker" className="role-label">
              {"Speaker"}
              <input
                id="checkbox-role-reg-speaker"
                name="speaker"
                type="checkbox"
                className="user-role-input"
                onChange={handleRegisterFormInputChange}
                checked={registerFormData.role.speaker}
                value={USER_ROLE.SPEAKER}
                disabled={registerFormData.role.attendee}
              />
              <span className="check-mark"></span>
            </label>
          </div>
        </div>

        <div>
          <ButtonCustom
            className={`w-full h-10 px-5 py-2 flex items-center justify-center gap-2 text-secondary-sLabel bg-primary-bg-interactiveBlue font-[600] !text-base border rounded-full hover:bg-primary-bg-interactiveBlueHover`}
            label={"Register"}
            handleClickWithLoader={onRegister}
          />
        </div>
      </div>
    );
  };

  /*-------------------------Main Render-----------------------------------*/
  return (
    <div className="p-prof-login-wrapper flex items-center justify-center">
      <div className="log-reg-box px-5 py-5 flex flex-col gap-10 text-primary-pText border border-primary-light-900">
        <div className="w-full flex bg-blue-200 font-semibold text-base">
          <div className="w-[50%] h-10">
            <button
              id="login-tab"
              className={`log-reg-tab w-full h-full ${
                activeTabId === "login-tab" ? "log-reg-active-tab" : ""
              }`}
              onClick={onTabClick}
            >
              Login
            </button>
          </div>
          <div className="w-[50%] h-10">
            <button
              id="register-tab"
              className={`log-reg-tab w-full h-full ${
                activeTabId === "register-tab" ? "log-reg-active-tab" : ""
              }`}
              onClick={onTabClick}
            >
              Register
            </button>
          </div>
        </div>

        {activeTabId === "login-tab" && <>{renderLoginSection()}</>}
        {activeTabId === "register-tab" && <>{renderRegisterSection()}</>}
      </div>
    </div>
  );
};

export default PageLoginOrRegister;
