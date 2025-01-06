import "primeicons/primeicons.css";
import React, {
  BaseSyntheticEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import ButtonCustom from "../components/ButtonCustom";
import DialogCustom from "../components/DialogCustom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Input from "../components/Input";
import RadioCustom from "../components/RadioCustom";
import { SESSION_STORAGE_ITEMS, SUBSCRIPTION_TYPE } from "../constant";
import { LINK_PAGE_CHECKOUT } from "../routes";
import SubscriptionService from "../services/SubscriptionService";
import { validatePostRequest } from "../utils/commonUtils";

const registerBeforeCheckOutBanner = (
  <div className="site-banner">
    <div className="text-sm">
      <p>{"Please login or register to continue !"}</p>
    </div>
  </div>
);

const initialSubscribeFormData = {
  name: "",
  email: "",
  jobTitle: "",
  subType: "",
};

const HCPWebsite: React.FC = () => {
  const location = useLocation();
  const [showRegistrationBanner, setShowRegistrationBanner] = useState(false);
  const [showSubscriptionTypeNotSelected, setShowSubscriptionTypeNotSelected] =
    useState(false);
  const [showSubscribeFormDialog, setShowSubscribeFormDialog] = useState(false);
  const [subscribeFormData, setSubscribeFormData] = useState(
    initialSubscribeFormData
  );
  const [showSubscribePopUp, setShowSubscribePopUp] = useState({
    isSuccess: false,
    showPopUp: false,
    headerContent: <div />,
    bodyContent: <div />,
  });
  const simpleValidator = useRef(
    new SimpleReactValidator({ className: "text-danger" })
  );
  const [_, forceUpdate] = useState<any>();

  useEffect(() => {
    if (location.state && location.state?.showRegCheckOutBanner) {
      let bannerInfoFromSession = sessionStorage.getItem(
        SESSION_STORAGE_ITEMS.REG_BANNER
      );
      if (bannerInfoFromSession) {
        const bannerInfo = JSON.parse(bannerInfoFromSession);
        bannerInfo?.display ? setShowRegistrationBanner(true) : null;
        setTimeout(() => {
          setShowRegistrationBanner(false);
          sessionStorage.removeItem(SESSION_STORAGE_ITEMS.REG_BANNER);
        }, 2000);
      }
    }
  }, [location.state]);

  useEffect(() => {
    const { name, email, jobTitle, subType } = subscribeFormData;
    if ((name && email && jobTitle && subType) || subType) {
      if (simpleValidator?.current?.errorMessages?.email) {
        setShowSubscriptionTypeNotSelected(false);
      }
    }
  }, [subscribeFormData]);

  /*----------------------------------Event Handlers------------------------------*/

  const handleSubscribeFormDataChange = (e: BaseSyntheticEvent) => {
    setSubscribeFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitSubscriptionForm = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid || !subscribeFormData.subType) {
      setShowSubscriptionTypeNotSelected(true);
      simpleValidator.current.showMessages();
      forceUpdate("");
      return;
    }

    const payload = {
      Subscriber: subscribeFormData.email,
      subscriber_name: subscribeFormData.name,
      subscription_type: subscribeFormData.subType,
      subscriber_jobtitle: subscribeFormData.jobTitle,
    };

    try {
      const res = await SubscriptionService.subscribe(payload);
      if (validatePostRequest(res)) {
        setShowSubscribePopUp({
          isSuccess: true,
          showPopUp: true,
          headerContent: <h1 className="text-2xl">Thank You!</h1>,
          bodyContent: (
            <div className="p-5">
              <p>You have {res?.data?.message}.</p>
            </div>
          ),
        });
        setShowSubscribeFormDialog(false);
        setSubscribeFormData(initialSubscribeFormData);
      }
    } catch (error) {
      setShowSubscribePopUp({
        isSuccess: false,
        showPopUp: true,
        headerContent: <h1 className="text-xl">Something went wrong!</h1>,
        bodyContent: (
          <div className="p-5">
            <p>Please retry after sometime.</p>
          </div>
        ),
      });
      setShowSubscribeFormDialog(false);
      console.error(error);
    }

    if (window.innerWidth <= 980) {
      window.location.reload();
    }
  };

  const renderSubscriptionDialog = (): ReactNode => {
    return (
      <div className="pt-5 flex flex-col">
        <div className="px-2">
          <Input
            className=""
            name={"name"}
            label={"Name"}
            type={"text"}
            value={subscribeFormData.name}
            handler={handleSubscribeFormDataChange}
            mandatory
            onBlur={() => {
              simpleValidator.current.showMessageFor("name");
            }}
            validationMessage={simpleValidator.current.message(
              "name",
              subscribeFormData.name,
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
            value={subscribeFormData.email}
            handler={handleSubscribeFormDataChange}
            mandatory
            onBlur={() => {
              simpleValidator.current.showMessageFor("email");
            }}
            validationMessage={simpleValidator.current.message(
              "email",
              subscribeFormData.email,
              "required|email"
            )}
          />
        </div>
        <div className="px-2">
          <Input
            className=""
            name={"jobTitle"}
            label={"Job Title"}
            type={"email"}
            value={subscribeFormData.jobTitle}
            handler={handleSubscribeFormDataChange}
            mandatory
            onBlur={() => {
              simpleValidator.current.showMessageFor("jobTitle");
            }}
            validationMessage={simpleValidator.current.message(
              "jobTitle",
              subscribeFormData.jobTitle,
              "required"
            )}
          />
        </div>

        <div className="px-2">
          <div className="mb-2 grid gap-1">
            <div>
              <p>
                Choose subscription type
                <span className="text-primary-asterisk">{"*"}</span>
              </p>
            </div>

            <div className="grid grid-cols-2">
              <div className="col-span-1">
                <RadioCustom
                  label={"Weekly"}
                  id={"sub-weekly"}
                  name={"subType"}
                  value={SUBSCRIPTION_TYPE.WEEKLY}
                  handler={handleSubscribeFormDataChange}
                  checked={subscribeFormData.subType === "weekly"}
                />
              </div>
              <div className="col-span-1">
                <RadioCustom
                  label={"Monthly"}
                  id={"sub-monthly"}
                  name={"subType"}
                  value={SUBSCRIPTION_TYPE.MONTHLY}
                  handler={handleSubscribeFormDataChange}
                  checked={subscribeFormData.subType === "monthly"}
                />
              </div>
              <div className="col-span-1">
                <RadioCustom
                  label={"Quarterly"}
                  id={"sub-quarterly"}
                  name={"subType"}
                  value={SUBSCRIPTION_TYPE.QUARTERLY}
                  handler={handleSubscribeFormDataChange}
                  checked={subscribeFormData.subType === "quarterly"}
                />
              </div>
              <div />
            </div>
          </div>
        </div>

        {showSubscriptionTypeNotSelected && (
          <div className="px-2 text-red-500 text-xs">
            {"Choose your subscription"}
          </div>
        )}

        <div className="self-center my-2">
          <ButtonCustom
            className="w-32 px-2 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-interactiveBlue border-primary-light-900 rounded-full hover:bg-primary-bg-interactiveBlueHover"
            label={"Submit"}
            handleClickWithLoader={onSubmitSubscriptionForm}
          />
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {showRegistrationBanner ? registerBeforeCheckOutBanner : null}
      <Header
        subscribeButtonHandler={() => {
          setShowSubscribeFormDialog(true);
        }}
      />
      <main>
        <Outlet />
      </main>
    
      <div>
          <button
            className="vertical-btn"
            onClick={() => {
              setShowSubscribeFormDialog(true);
            }}
          >
            {"Subscribe"}
          </button>
      </div>

      <DialogCustom
        dialogVisible={showSubscribeFormDialog}
        containerClassName={
          "max-w-[500px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={<h1 className="text-2xl">Subscribe</h1>}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={renderSubscriptionDialog()}
        onHideDialog={() => {
          if (!showSubscribeFormDialog) return;
          setShowSubscribeFormDialog(false);
        }}
      />
      
      <DialogCustom
        dialogVisible={showSubscribePopUp.showPopUp}
        containerClassName={
          "max-w-[500px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={showSubscribePopUp.headerContent}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={showSubscribePopUp.bodyContent}
        onHideDialog={() => {
          setShowSubscribePopUp((prev) => ({ ...prev, showPopUp: false }));
        }}
      />
      {location?.pathname?.includes(LINK_PAGE_CHECKOUT) ? null : <Footer />}
    </React.Fragment>
  );
};
export default HCPWebsite;
