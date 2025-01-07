import jsonToFormData from "json-form-data";
import { InputTextarea } from "primereact/inputtextarea";
import React, {
  BaseSyntheticEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import AuthValidator from "../../components/AuthValidator";
import ButtonCustom from "../../components/ButtonCustom";
import CountrySelector from "../../components/CountrySelector";
import Input from "../../components/Input";
import {
  COUPON_MESSAGE,
  COUPON_STATUS,
  COUPON_TYPE,
  FORM_DATA_OPTIONS,
  HEALTH_PROFS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
  PURCHASE_CATEGORY,
  SESSION_STORAGE_ITEMS,
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
  participantsDetail: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
  address: "",
};

export const PURCHASE_ITEM: {
  NEWSLETTER: PURCHASE_TYPE;
  WEBINAR: PURCHASE_TYPE;
} = {
  NEWSLETTER: "NEWSLETTER",
  WEBINAR: "WEBINAR",
};

let initialCartValue = 0;

const initialCouponMessage = {
  showMessage: false,
  success: false,
  invalid: false,
};

const PageCart: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseItem: PURCHASE_TYPE = location?.search?.includes(
    "purchase-item=webinar"
  )
    ? "WEBINAR"
    : location?.search?.includes("purchase-item=newsletter")
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
  const [couponMessage, setCouponMessage] = useState({
    ...initialCouponMessage,
  });

  const simpleValidator = useRef(
    new SimpleReactValidator({ className: "text-danger" })
  );
  const [_, forceUpdate] = useState<any>();

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
        if (purchaseItem === PURCHASE_ITEM.WEBINAR) {
          const purChaseInfo = localStorage.getItem(
            LOCAL_STORAGE_ITEMS.PURCHASE_INFO
          );

          if (purChaseInfo) {
            const parsedPurchaseInfo = JSON.parse(purChaseInfo);
            setPurchaseWebinarData(parsedPurchaseInfo);
            getWebinarDetails(parsedPurchaseInfo.webinarId);
            initialCartValue = parsedPurchaseInfo?.cartTotal;
          }
        } else if (purchaseItem === PURCHASE_ITEM.NEWSLETTER) {
          const purchaseInfoNewsletterInfo = localStorage.getItem(
            LOCAL_STORAGE_ITEMS.PURCHASE_INFO_NEWSLETTER
          );
          if (purchaseInfoNewsletterInfo) {
            const parsedPurchaseInfo = JSON.parse(purchaseInfoNewsletterInfo);
            setPurchaseNewsletterData(parsedPurchaseInfo);
            getNewsletterDetails(parsedPurchaseInfo?.newsletterId);
            initialCartValue = parsedPurchaseInfo?.cartTotal;
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
      (couponItem: any) =>
        couponItem.status === COUPON_STATUS.ACTIVE &&
        couponItem?.coupon === coupon
    );

    if (validSelectedCoupon) {
      if (validSelectedCoupon?.type === COUPON_TYPE.BY_PERCENTAGE) {
        if (purchaseItem === PURCHASE_ITEM.WEBINAR) {
          cartOrderValue = purchaseWebinarData?.cartTotal;
          cartOrderValue =
            cartOrderValue -
            cartOrderValue * validSelectedCoupon?.amount * 0.01;
          setPurchaseWebinarData((prev: any) => ({
            ...prev,
            cartTotal: Math.floor(cartOrderValue),
          }));
          setCouponMessage({
            ...initialCouponMessage,
            showMessage: true,
            success: true,
          });
        } else if (purchaseItem === PURCHASE_ITEM.NEWSLETTER) {
          cartOrderValue = purchaseNewsletterData?.cartTotal;
          cartOrderValue =
            cartOrderValue -
            cartOrderValue * validSelectedCoupon?.amount * 0.01;
          setPurchaseNewsletterData((prev: any) => ({
            ...prev,
            cartTotal: Math.floor(cartOrderValue),
          }));
          setCouponMessage({
            ...initialCouponMessage,
            showMessage: true,
            success: true,
          });
        }
      } else if (validSelectedCoupon?.type === COUPON_TYPE.BY_AMOUNT) {
        if (purchaseItem === PURCHASE_ITEM.WEBINAR) {
          cartOrderValue = purchaseWebinarData?.cartTotal;
          cartOrderValue = cartOrderValue - validSelectedCoupon?.amount;
          setPurchaseWebinarData((prev: any) => ({
            ...prev,
            cartTotal:
              Math.floor(cartOrderValue) <= 0 ? 1 : Math.floor(cartOrderValue),
          }));
          setCouponMessage({
            ...initialCouponMessage,
            showMessage: true,
            success: true,
          });
        } else if (purchaseItem === PURCHASE_ITEM.NEWSLETTER) {
          cartOrderValue = purchaseNewsletterData?.cartTotal;
          cartOrderValue = cartOrderValue - validSelectedCoupon?.amount;
          setPurchaseNewsletterData((prev: any) => ({
            ...prev,
            cartTotal:
              Math.floor(cartOrderValue) <= 0 ? 1 : Math.floor(cartOrderValue),
          }));
          setCouponMessage({
            ...initialCouponMessage,
            showMessage: true,
            success: true,
          });
        }
      }
      setIsCouponApplied(true);
    }

    if (!validSelectedCoupon && !couponMessage.invalid) {
      setCouponMessage({
        ...initialCouponMessage,
        showMessage: true,
        invalid: true,
      });
    }
  };

  const onCheckout = async () => {
    const formValid = simpleValidator.current.allValid();
    if (!formValid) {
      simpleValidator.current.showMessages();
      forceUpdate("");
      return;
    }

    let cartInfo = { ...userData, ...cartFormData };
    let stripePaymentInfo: any = {
      customerName: cartFormData.customerName,
      email: cartFormData.billingEmail || userData.email,
      country: cartFormData?.country,
      purchaseItem: purchaseItem,
    };
    
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: any = today.getMonth() + 1;
    let dd: any = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    const formattedToday = dd + mm + yyyy;
    const generatedInvoice = `${formattedToday}_HCP_${Math.random()
      .toString(36)
      .substring(2, 10)
      ?.toUpperCase()}`;
    
    if (purchaseItem === PURCHASE_ITEM.WEBINAR) {
      cartInfo = {
        ...cartInfo,
        ...webinarData,
        ...purchaseWebinarData,
      };
      stripePaymentInfo = {
        ...stripePaymentInfo,
        amount: purchaseWebinarData?.cartTotal,
      };
    } else if (purchaseItem === PURCHASE_ITEM.NEWSLETTER) {
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

    sessionStorage.setItem(
      SESSION_STORAGE_ITEMS.INVOICE_NUMBER,
      generatedInvoice
    );

    navigate(LINK_PAGE_CHECKOUT, {
      state: {
        ...stripePaymentInfo,
      },
    });
  };

  const onCancel = async () => {
    if (purchaseItem === PURCHASE_ITEM.WEBINAR) {
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
    } else if (purchaseItem === PURCHASE_ITEM.NEWSLETTER) {
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
      sessionTranscript: true,
      priceTranscript: 0,
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

  const renderCouponMessage = (
    messageType: "success" | "invalid"
  ): ReactNode => {
    return (
      <div className="mt-1 mb-2">
        {messageType === COUPON_MESSAGE.SUCCESS ? (
          <React.Fragment>
            <p className="text-xs text-green-500">
              You have saved
              <span className="mx-1">
                {purchaseItem === PURCHASE_ITEM.WEBINAR
                  ? `$${initialCartValue - purchaseWebinarData?.cartTotal}`
                  : purchaseItem === PURCHASE_ITEM.NEWSLETTER
                  ? `$${initialCartValue - purchaseNewsletterData?.cartTotal}`
                  : "N.A."}
              </span>
            </p>
            <div className="flex items-center justify-between font-bold">
              <span className="text-sm">Final Amount</span>
              <span className="text-lg">
                {"$"}
                {purchaseItem === PURCHASE_ITEM.WEBINAR
                  ? purchaseWebinarData?.cartTotal ?? "N.A."
                  : purchaseItem === PURCHASE_ITEM.NEWSLETTER
                  ? purchaseNewsletterData?.cartTotal
                  : "N.A."}
              </span>
            </div>
          </React.Fragment>
        ) : (
          <p className="text-xs text-red-500">Invalid Coupon</p>
        )}
      </div>
    );
  };

  return (
    <AuthValidator>
      <div className="page-margin">
        <section className="p-5 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col-reverse screen_var_one:flex-row gap-10 items-start justify-between">
            <div className="w-full screen_var_one:w-[50%] py-5 flex flex-col gap-5">
              <div className="px-2">
                <Input
                  className=""
                  name={"customerName"}
                  label={"Customer Name"}
                  type={"text"}
                  value={cartFormData.customerName}
                  handler={handleCartFormChange}
                  mandatory
                  onBlur={() => {
                    simpleValidator.current.showMessageFor("customerName");
                  }}
                  validationMessage={simpleValidator.current.message(
                    "customerName",
                    cartFormData.customerName,
                    "required"
                  )}
                />
                <small className="!text-primary-error"></small>
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
                  onBlur={() => {
                    simpleValidator.current.showMessageFor("billingEmail");
                  }}
                  validationMessage={simpleValidator.current.message(
                    "billingEmail",
                    cartFormData.billingEmail,
                    "required|email"
                  )}
                />
              </div>

              {purchaseWebinarData?.purchaseCategory ===
                PURCHASE_CATEGORY.CORPORATE && (
                <div className="px-2 flex flex-col gap-1">
                  <label>
                    {"Participants Email"}
                    <span className="text-xs">
                      {`(Our Customer Support Team will reach out to you)`}
                    </span>
                  </label>
                  <InputTextarea
                    className={
                      "w-full min-h-40 p-2 border border-primary-light-900"
                    }
                    placeholder="Please enter participants details such as email addresses, name etc. In case you don't have participants detail our customer support team will reach out to you"
                    name="participantsDetail"
                    value={cartFormData.participantsDetail}
                    onChange={handleCartFormChange}
                    maxLength={1000}
                  />
                </div>
              )}

              <div className="px-2 flex flex-col gap-1">
                <label>
                  {"Country"}
                  <span className="text-primary-asterisk">*</span>
                </label>
                <CountrySelector
                  name="country"
                  getSelectedCountry={handleCountryChange}
                  validationMessage={simpleValidator.current.message(
                    "country",
                    cartFormData.country,
                    "required"
                  )}
                />
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
                  maxLength={500}
                />
                <div className="text-red-500 text-xs">
                  {simpleValidator.current.message(
                    "address",
                    cartFormData.address,
                    "required"
                  )}
                </div>
              </div>
            </div>

            {isLoadingCartItem ? (
              <div className="w-full screen_var_one:w-[50%] h-[300px] mt-5 flex items-center justify-center border border-primary-light-900 rounded-lg">
                <span>
                  <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
                </span>
              </div>
            ) : (
              <div className="w-full screen_var_one:w-[50%] mt-5 p-5 flex flex-col gap-10 border border-primary-light-900 rounded-lg">
                <div className="text-base">
                  {purchaseItem === PURCHASE_ITEM.WEBINAR
                    ? webinarData?.topic ?? "N.A."
                    : purchaseItem === PURCHASE_ITEM.NEWSLETTER
                    ? newsletterData?.topic ?? "N.A."
                    : "N.A"}
                </div>

                <div className="flex items-center justify-between font-bold">
                  <span className="text-sm">Order Amount</span>
                  <span className="text-lg">
                    {"$"}
                    {initialCartValue
                      ? initialCartValue
                      : purchaseItem === PURCHASE_ITEM.WEBINAR
                      ? purchaseWebinarData?.cartTotal ?? "N.A."
                      : purchaseItem === PURCHASE_ITEM.NEWSLETTER
                      ? purchaseNewsletterData?.cartTotal
                      : "N.A."}
                  </span>
                </div>

                <div className="w-full">
                  <div className="w-full flex items-center justify-between gap-5">
                    <input
                      className="app-input w-full h-8 p-2 border border-primary-light-900 !outline-none text-sm text-primary-pText"
                      name={"coupon"}
                      type={"text"}
                      placeholder="Coupon code"
                      value={coupon}
                      disabled={isCouponApplied}
                      onChange={(event: BaseSyntheticEvent) => {
                        setCoupon(event.target.value);
                        setCouponMessage(initialCouponMessage);
                      }}
                    />

                    <button
                      className="w-24 h-full text-center leading-6 border rounded-full text-xs hover:bg-primary-bg-teal hover:text-white disabled:bg-disabled disabled:text-primary-dark-100"
                      onClick={onApplyCoupon}
                      disabled={isCouponApplied}
                    >
                      <span>Apply</span>
                    </button>
                  </div>

                  {couponMessage.showMessage && couponMessage.success && (
                    <>{renderCouponMessage("success")}</>
                  )}

                  {couponMessage.showMessage && couponMessage.invalid && (
                    <>{renderCouponMessage("invalid")}</>
                  )}
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-5">
                  <div className="w-full">
                    <ButtonCustom
                      className="btn-custom-secondary w-full px-2 py-1 flex gap-2 justify-center text-primary-pLabel border-2 border-primary-light-900 rounded-full hover:bg-slate-50"
                      label={"Cancel"}
                      type="button"
                      handleClickWithLoader={onCancel}
                    />
                  </div>
                  <div className="w-full">
                    <ButtonCustom
                      className="w-full px-2 py-1 flex gap-2 justify-center text-white font-semibold bg-primary-bg-interactiveBlue border border-primary-light-900 rounded-full hover:bg-primary-bg-interactiveBlueHover"
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
