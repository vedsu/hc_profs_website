import jsonToFormData from "json-form-data";
import { InputTextarea } from "primereact/inputtextarea";
import React, {
  BaseSyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import ButtonCustom from "../../components/ButtonCustom";
import CountrySelector from "../../components/CountrySelector";
import Input from "../../components/Input";
import {
  COUPON_TYPE,
  FORM_DATA_OPTIONS,
  HEALTH_PROFS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
} from "../../constant";
import {
  LINK_PAGE_CHECKOUT,
  LINK_PAGE_NEWSLETTERS,
  LINK_PAGE_WEBINAR_LISTING,
} from "../../routes";
import CouponService from "../../services/CouponService";
import NewsletterService from "../../services/NewsletterService";
import OrderService from "../../services/OrderService";
import WebinarService from "../../services/WebinarService";
import {
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";

type PURCHASE_TYPE = "NEWSLETTER" | "WEBINAR" | null;

const initialCartFormData = {
  customerName: "",
  billingEmail: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
  address: "",
};

export const PURCHASE_TYPE_LITERAL: {
  NEWSLETTER: PURCHASE_TYPE;
  WEBINAR: PURCHASE_TYPE;
} = {
  NEWSLETTER: "NEWSLETTER",
  WEBINAR: "WEBINAR",
};

const PageCart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseType: PURCHASE_TYPE = location?.search?.includes(
    "purchase-category=webinar"
  )
    ? "WEBINAR"
    : location?.search?.includes("purchase-category=newsletter")
    ? "NEWSLETTER"
    : null;
  const [userData, setUserData] = useState<any>(null);
  const [webinarData, setWebinarData] = useState<any>(null);
  const [purchaseWebinarData, setPurchaseWebinarData] = useState<any>(null);
  const [newsletterData, setNewsletterData] = useState<any>(null);
  const [purchaseNewsletterData, setPurchaseNewsletterData] =
    useState<any>(null);
  const [isLoadingCartItem, setIsLoadingCartItem] = useState(true);
  const [cartFormData, setCartFormData] = useState(initialCartFormData);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponList, setCouponList] = useState([]);

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

  const getNewsletterDetails = async (newsletterId: string) => {
    try {
      const response = await NewsletterService.getNewsletterById(
        "/" + newsletterId
      );
      if (validateGetRequest(response)) {
        const newsletter = response?.data;
        // newsletter info
        if (newsletter) {
          setNewsletterData(newsletter);
          setIsLoadingCartItem(false);
        } else {
          setNewsletterData(null);
          setIsLoadingCartItem(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCoupons = async () => {
    try {
      const response = await CouponService.getCouponList();
      if (validateGetRequest(response)) {
        setCouponList(response?.data);
      }
    } catch (error) {}
  };

  /*------------------------useEffect----------------------------*/
  useEffect(() => {
    const onMount = async () => {
      const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setUserData(parsedUserInfo);
        if (purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR) {
          const purChaseInfo = localStorage.getItem(
            LOCAL_STORAGE_ITEMS.PURCHASE_INFO
          );
          if (purChaseInfo) {
            const parsedPurchaseInfo = JSON.parse(purChaseInfo);
            setPurchaseWebinarData(parsedPurchaseInfo);
            getWebinarDetails(parsedPurchaseInfo.webinarId);
          }
        } else if (purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER) {
          const purchaseInfoNewsletterInfo = localStorage.getItem(
            LOCAL_STORAGE_ITEMS.PURCHASE_INFO_NEWSLETTER
          );
          if (purchaseInfoNewsletterInfo) {
            const parsedPurchaseInfo = JSON.parse(purchaseInfoNewsletterInfo);
            setPurchaseNewsletterData(parsedPurchaseInfo);
            getNewsletterDetails(parsedPurchaseInfo?.newsletterId);
          }
        }

        getCoupons();
      }
    };
    onMount();
  }, []);

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

  const onApplyCoupon = async () => {
    let cartOrderValue = 0;
    const validSelectedCoupon: any = couponList?.find(
      (couponItem: any) => couponItem?.coupon === coupon
    );

    if (
      validSelectedCoupon &&
      validSelectedCoupon?.type === COUPON_TYPE.BY_PERCENTAGE
    ) {
      if (purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR) {
        cartOrderValue = purchaseWebinarData?.cartTotal;
        cartOrderValue =
          cartOrderValue - cartOrderValue * validSelectedCoupon?.amount * 0.01;
        setPurchaseWebinarData((prev: any) => ({
          ...prev,
          cartTotal: Math.floor(cartOrderValue),
        }));
      } else if (purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER) {
        cartOrderValue = purchaseNewsletterData?.cartTotal;
        cartOrderValue =
          cartOrderValue - cartOrderValue * validSelectedCoupon?.amount * 0.01;
        setPurchaseNewsletterData((prev: any) => ({
          ...prev,
          cartTotal: Math.floor(cartOrderValue),
        }));
      }
    } else if (
      validSelectedCoupon &&
      validSelectedCoupon?.type === COUPON_TYPE.BY_AMOUNT
    ) {
      if (purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR) {
        cartOrderValue = purchaseWebinarData?.cartTotal;
        cartOrderValue = cartOrderValue - validSelectedCoupon?.amount;
        setPurchaseWebinarData((prev: any) => ({
          ...prev,
          cartTotal:
            Math.floor(cartOrderValue) <= 0 ? 10 : Math.floor(cartOrderValue),
        }));
      } else if (purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER) {
        cartOrderValue = purchaseNewsletterData?.cartTotal;
        cartOrderValue = cartOrderValue - validSelectedCoupon?.amount;
        setPurchaseNewsletterData((prev: any) => ({
          ...prev,
          cartTotal:
            Math.floor(cartOrderValue) <= 0 ? 10 : Math.floor(cartOrderValue),
        }));
      }
    }

    setIsCouponApplied(true);
  };

  const onCheckout = async () => {
    let cartInfo = { ...userData, ...cartFormData };
    let stripePaymentInfo: any = {
      customerName: cartFormData.customerName,
      email: cartFormData.billingEmail || userData.email,
      country: cartFormData?.country,
      purchaseType: purchaseType,
    };
    if (purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR) {
      cartInfo = {
        ...cartInfo,
        ...webinarData,
        ...purchaseWebinarData,
      };
      stripePaymentInfo = {
        ...stripePaymentInfo,
        amount: purchaseWebinarData?.cartTotal,
      };
    } else if (purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER) {
      cartInfo = { ...cartInfo, ...newsletterData, ...purchaseNewsletterData };
      stripePaymentInfo = {
        ...stripePaymentInfo,
        amount: purchaseNewsletterData?.cartTotal,
      };
    }

    localStorage.setItem(
      LOCAL_STORAGE_ITEMS.CART_DATA,
      JSON.stringify(cartInfo)
    );

    navigate(LINK_PAGE_CHECKOUT, {
      state: {
        ...stripePaymentInfo,
      },
    });
  };

  const onCancel = async () => {
    if (purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR) {
      const webinarOrderPayloadJSON = prepareWebinarCancelPayload();

      const formDataPayload = jsonToFormData(
        webinarOrderPayloadJSON,
        FORM_DATA_OPTIONS
      );

      try {
        const res = await OrderService.createOrder(formDataPayload);
        if (validatePostRequest(res)) {
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_INFO);
          navigate(LINK_PAGE_WEBINAR_LISTING);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER) {
      const newsletterOrderPayloadJSON = prepareNewsletterCancelPayload();

      const formDataPayload = jsonToFormData(
        newsletterOrderPayloadJSON,
        FORM_DATA_OPTIONS
      );

      try {
        const res = await OrderService.createNewsletterOrder(formDataPayload);
        if (validatePostRequest(res)) {
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_INFO_NEWSLETTER);
          navigate(LINK_PAGE_NEWSLETTERS);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const prepareWebinarCancelPayload = () => {
    return {
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
  };

  const prepareNewsletterCancelPayload = () => {
    return {
      customeremail: userData?.email,
      paymentstatus: PAYMENT_STATUS.PENDING,
      topic: newsletterData?.topic,
      orderamount: null,
    };
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
                <div className="text-base">
                  {purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR
                    ? webinarData?.topic ?? "N.A."
                    : purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER
                    ? newsletterData?.topic ?? "N.A."
                    : "N.A"}
                </div>

                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm">Order Amount</span>
                  <span className="text-lg">
                    {"$"}
                    {purchaseType === PURCHASE_TYPE_LITERAL.WEBINAR
                      ? purchaseWebinarData?.cartTotal ?? "N.A."
                      : purchaseType === PURCHASE_TYPE_LITERAL.NEWSLETTER
                      ? purchaseNewsletterData?.cartTotal
                      : "N.A."}
                  </span>
                </div>

                <div className="w-full flex gap-10 items-center justify-between">
                  <input
                    className="flex-grow app-input h-8 p-2 border border-primary-light-900 !outline-none text-sm text-primary-pText"
                    name={"coupon"}
                    type={"text"}
                    placeholder="Coupon code"
                    value={coupon}
                    disabled={isCouponApplied}
                    onChange={(event: BaseSyntheticEvent) => {
                      setCoupon(event.target.value);
                    }}
                  />

                  <button
                    className="max-w-fit px-5 h-full text-center leading-6 border rounded-full text-xs hover:bg-primary-bg-teal hover:text-white disabled:bg-disabled disabled:text-primary-dark-100"
                    onClick={onApplyCoupon}
                    disabled={isCouponApplied}
                  >
                    <span>Apply</span>
                  </button>
                </div>

                <div className="w-full flex  items-center justify-center flex-wrap gap-5">
                  <div>
                    <ButtonCustom
                      className="btn-custom-secondary w-full sm:w-32 px-2 py-1 flex gap-2 justify-center text-primary-pLabel border-2 border-primary-light-900 rounded-full hover:bg-slate-50"
                      label={"Cancel"}
                      type="button"
                      handleClickWithLoader={onCancel}
                    />
                  </div>
                  <div>
                    <ButtonCustom
                      className="w-full sm:w-32 px-2 py-1 flex gap-2 justify-center text-white font-semibold bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-interactiveBlueHover"
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
