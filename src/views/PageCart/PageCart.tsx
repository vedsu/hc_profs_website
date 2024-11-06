import jsonToFormData from "json-form-data";
import { InputTextarea } from "primereact/inputtextarea";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import ButtonCustom from "../../components/ButtonCustom";
import CountrySelector from "../../components/CountrySelector";
import Input from "../../components/Input";
import {
  FORM_DATA_OPTIONS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
  HEALTH_PROFS,
} from "../../constant";
import { LINK_PAGE_CHECKOUT, LINK_PAGE_WEBINAR_LISTING } from "../../routes";
import OrderService from "../../services/OrderService";
import WebinarService from "../../services/WebinarService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

const initialCartFormData = {
  customerName: "",
  billingEmail: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
  address: "",
};

const PageCart: React.FC = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [purchaseWebinarData, setPurchaseWebinarData] = useState<any>(null);
  const [webinarData, setWebinarData] = useState<any>(null);
  const [isLoadingCartItem, setIsLoadingCartItem] = useState(true);
  const [cartFormData, setCartFormData] = useState(initialCartFormData);

  /*---------------------------Service Calls------------------------------*/
  const getWebinarDetails = useCallback(async (webinarId: string) => {
    try {
      const res = await WebinarService.getWebinarById(webinarId);
      if (validateGetRequest(res)) {
        const webinar = res?.data;
        // webinar info
        if (webinar) {
          setWebinarData(webinar);
          setIsLoadingCartItem(false);
        } else {
          setWebinarData(null);
          setIsLoadingCartItem(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  /*------------------------useEffect----------------------------*/
  useEffect(() => {
    const onMount = async () => {
      const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);
      const purChaseInfo = localStorage.getItem(
        LOCAL_STORAGE_ITEMS.PURCHASE_INFO
      );

      if (userInfo && purChaseInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        const parsedPurchaseInfo = JSON.parse(purChaseInfo);
        setUserData(parsedUserInfo);
        setPurchaseWebinarData(parsedPurchaseInfo);
        getWebinarDetails(parsedPurchaseInfo.webinarId);
      }
    };
    onMount();
  }, [getWebinarDetails]);

  /*-----------------------Event Handlers------------------------------*/

  const handleCartFormChange = (e: BaseSyntheticEvent) => {
    setCartFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleCountryChange = (selectedCountry: any) => {
    setCartFormData((prev) => {
      return {
        ...prev,
        country: selectedCountry,
      };
    });
  };

  const onCheckout = async () => {
    localStorage.setItem(
      LOCAL_STORAGE_ITEMS.CART_DATA,
      JSON.stringify({
        ...userData,
        ...webinarData,
        ...purchaseWebinarData,
        ...cartFormData,
      })
    );

    navigate(LINK_PAGE_CHECKOUT, {
      state: {
        amount: purchaseWebinarData?.cartTotal,
        customerName: cartFormData.customerName,
        email: cartFormData.billingEmail || userData.email,
        country: cartFormData?.country,
      },
    });
  };

  const onCancel = async () => {
    const jsonPayload = {
      customeremail: userData?.email,
      paymentstatus: PAYMENT_STATUS.PENDING,
      billingemail: null,
      website: HEALTH_PROFS.WEBSITE,
      orderamount: null,
      topic: webinarData?.topic,
      webinardate: webinarData?.date,
      sessionLive: webinarData?.sessionLive,
      priceLive: webinarData?.priceLive,
      sessionRecording: webinarData?.sessionRecording,
      priceRecording: webinarData?.priceRecording,
      sessionDigitalDownload: webinarData?.sessionDigitalDownload,
      priceDigitalDownload: webinarData?.priceDigitalDownload,
      sessionTranscript: webinarData?.sessionTranscript,
      priceTranscript: webinarData?.priceTranscript,
      customername: null,
      country: null,
      state: null,
      city: null,
      zipcode: null,
      address: null,
      invoice_number: null,
    };

    const formDataPayload = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

    try {
      const res = await OrderService.createOrder(formDataPayload);
      if (validatePostRequest(res)) {
        localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_INFO);
        navigate(LINK_PAGE_WEBINAR_LISTING);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthValidator>
      <div className="page-margin">
        <section className="py-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-start justify-between">
            <div className="w-[50%] flex flex-col gap-5">
              <div className="py-5 flex flex-col gap-5">
                <div className="px-2">
                  <Input
                    className=""
                    name={"customerName"}
                    label={"Customer Name"}
                    type={"text"}
                    value={cartFormData.customerName}
                    handler={handleCartFormChange}
                    mandatory
                  />
                </div>
                <div className="px-2">
                  <Input
                    className=""
                    name={"billingEmail"}
                    label={"Billing Email"}
                    type={"email"}
                    value={cartFormData.billingEmail}
                    handler={handleCartFormChange}
                    mandatory
                  />
                </div>
                <div className="px-2 flex flex-col gap-1">
                  <label>
                    {"Country"}
                    <span className="text-primary-asterisk">*</span>
                  </label>
                  <CountrySelector getSelectedCountry={handleCountryChange} />
                  {/* <small></small> */}
                </div>
                <div className="px-2">
                  <Input
                    className=""
                    name={"state"}
                    label={"State"}
                    type={"text"}
                    value={cartFormData.state}
                    handler={handleCartFormChange}
                  />
                </div>
                <div className="px-2">
                  <Input
                    className=""
                    name={"city"}
                    label={"City"}
                    type={"text"}
                    value={cartFormData.city}
                    handler={handleCartFormChange}
                  />
                </div>
                <div className="px-2">
                  <Input
                    className=""
                    name={"zipcode"}
                    label={"Zipcode"}
                    type={"text"}
                    value={cartFormData.zipcode}
                    handler={handleCartFormChange}
                  />
                </div>

                <div className="px-2 flex flex-col gap-1">
                  <label>
                    {"Address"}
                    <span className="text-primary-asterisk">{"*"}</span>
                  </label>
                  <InputTextarea
                    className={
                      "w-full min-h-40 p-2 border border-primary-light-900"
                    }
                    name="address"
                    value={cartFormData.address}
                    onChange={handleCartFormChange}
                    maxLength={2000}
                  />
                </div>
              </div>
            </div>

            {isLoadingCartItem ? (
              <div className="w-[40%] h-[400px] mt-5 flex items-center justify-center border border-primary-light-900 rounded-lg">
                <span>
                  <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
                </span>
              </div>
            ) : (
              <div className="w-[40%] mt-5 p-5 flex flex-col gap-5 border border-primary-light-900 rounded-lg">
                <div className="text-base">{webinarData?.topic ?? "N.A."}</div>

                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm">Order Amount</span>
                  <span className="text-lg">
                    {"$"}
                    {purchaseWebinarData?.cartTotal ?? "N.A."}
                  </span>
                </div>

                <div className="w-full flex  items-center justify-center flex-wrap gap-5">
                  <div>
                    <ButtonCustom
                      className="btn-custom-secondary w-32 px-2 flex gap-2 justify-center text-primary-pLabel border-2 border-primary-light-900 rounded-full hover:bg-slate-50"
                      label={"Cancel"}
                      type="button"
                      handleClickWithLoader={onCancel}
                    />
                  </div>
                  <div>
                    <ButtonCustom
                      className="w-32 px-2 flex gap-2 justify-center text-primary-pTextLight bg-primary-bg-teal border border-primary-light-900 rounded-full hover:bg-primary-bg-lightTeal"
                      label={"Checkout"}
                      type="submit"
                      handleClickWithLoader={onCheckout}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </AuthValidator>
  );
};

export default PageCart;
