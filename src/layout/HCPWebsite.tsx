import "primeicons/primeicons.css";
import React, {
  BaseSyntheticEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { Outlet, useLocation } from "react-router-dom";
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
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [showSubscribeFormDialog, setShowSubscribeFormDialog] = useState(false);
  const [subscribeFormData, setSubscribeFormData] = useState(
    initialSubscribeFormData
  );

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

  /*----------------------------------Event Handlers------------------------------*/

  const handleSubscribeFormDataChange = (e: BaseSyntheticEvent) => {
    setSubscribeFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitSubscriptionForm = async () => {
    const payload = {
      Subscriber: subscribeFormData.email,
      subscriber_name: subscribeFormData.name,
      subscription_type: subscribeFormData.subType,
      subscriber_jobtitle: subscribeFormData.jobTitle,
    };
    try {
      const res = await SubscriptionService.subscribe(payload);
      if (validatePostRequest(res)) {
        setShowSubscribeFormDialog(false);
        setIsSubscribed(true);
        setSubscribeFormData(initialSubscribeFormData);
      }
    } catch (error) {
      console.error(error);
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
          />
          {/* <small></small> */}
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
          />
          {/* <small></small> */}
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
          />
          {/* <small></small> */}
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
          {/* <small></small> */}
        </div>
        <div className="self-center my-2">
          <ButtonCustom
            className="w-32 px-2 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-teal border border-primary-light-900 rounded-full hover:bg-primary-bg-lightTeal"
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
      <Header />
      <main>
        <Outlet />
      </main>

      {isSubscribed ? (
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
      ) : null}

      <DialogCustom
        dialogVisible={showSubscribeFormDialog}
        containerClassName={
          "max-w-[668px] p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={<h1 className="text-2xl">Subscribe</h1>}
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={renderSubscriptionDialog()}
        onHideDialog={() => {
          if (!showSubscribeFormDialog) return;
          setShowSubscribeFormDialog(false);
        }}
      />

      {location?.pathname?.includes(LINK_PAGE_CHECKOUT) ? null : <Footer />}
    </React.Fragment>
  );
};
export default HCPWebsite;
