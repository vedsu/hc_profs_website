import jsonToFormData from "json-form-data";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import {
  FORM_DATA_OPTIONS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
  PURCHASE_CATEGORY,
  SESSION_STORAGE_ITEMS,
} from "../../constant";
import { LINK_ATTENDEE_DASHBOARD, LINK_SPEAKER_DASHBOARD } from "../../routes";
import OrderService from "../../services/OrderService";
import {
  clearLocalAndSessionStorage,
  validatePostRequest,
} from "../../utils/commonUtils";
import { PURCHASE_ITEM } from "../PageCart/PageCart";

const initialMessageData = {
  generatedInvoiceNum: "",
  generatedInvoiceDate: "",
};

const PageConfirmPayment = () => {
  const navigate = useNavigate();

  const [paymentSuccessMessageData, setPaymentSuccessMessageData] =
    useState<any>({ ...initialMessageData });

  useEffect(() => {
    const onMount = async () => {
      const paymentSuccessInfo = localStorage?.getItem(
        LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS
      );

      const freeNewsletterPurchaseInfo = localStorage.getItem(
        LOCAL_STORAGE_ITEMS.PURCHASE_INFO_FREE_NEWSLETTER
      );

      if (paymentSuccessInfo) {
        const parsedPaymentSuccessInfo = JSON.parse(paymentSuccessInfo);

        if (parsedPaymentSuccessInfo?.purchaseItem === PURCHASE_ITEM.WEBINAR) {
          await createWebinarOrder();
          redirectToDashboard();
        }

        if (
          parsedPaymentSuccessInfo?.purchaseItem === PURCHASE_ITEM.NEWSLETTER
        ) {
          await createNewsletterOrder();
          redirectToDashboard();
        }
      } else if (freeNewsletterPurchaseInfo) {
        const parsedFreeNewsletterPurchaseInfo = JSON.parse(
          freeNewsletterPurchaseInfo
        );
        setPaymentSuccessMessageData(parsedFreeNewsletterPurchaseInfo);
        localStorage.removeItem(
          LOCAL_STORAGE_ITEMS.PURCHASE_INFO_FREE_NEWSLETTER
        );
        redirectToDashboard();
      }
    };
    onMount();
  }, []);

  /*---------------------------Service Calls------------------------------*/
  const createWebinarOrder = async () => {
    const cartData = localStorage.getItem(LOCAL_STORAGE_ITEMS.CART_DATA);
    const paymentSuccessInfo = localStorage?.getItem(
      LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS
    );
    if (cartData) {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm: any = today.getMonth() + 1;
      let dd: any = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const invoiceFormattedToday = dd + "/" + mm + "/" + yyyy;

      const parsedCartInfo = JSON.parse(cartData);
      if (paymentSuccessInfo) {
        const parsedPaymentSuccessInfo = JSON.parse(paymentSuccessInfo);

        let jsonPayloadWebinarOrder: any = {
          customeremail: parsedCartInfo?.email,
          paymentstatus: PAYMENT_STATUS.PURCHASED,
          billingemail: parsedPaymentSuccessInfo?.email,
          orderamount: parsedCartInfo?.cartTotal,
          order_datetimezone: parsedPaymentSuccessInfo?.date_time,
          topic: parsedCartInfo?.topic,
          webinardate: parsedCartInfo?.date,
          sessionLive: parsedCartInfo?.webinarSessionLive,
          priceLive: parsedCartInfo?.priceLive,
          sessionRecording: parsedCartInfo?.webinarSessionRecording,
          priceRecording: parsedCartInfo?.priceRecording,
          sessionDigitalDownload: parsedCartInfo?.webinarSessionDD,
          priceDigitalDownload: parsedCartInfo?.priceDigitalDownload,
          sessionTranscript: true,
          priceTranscript: 0,
          customername: parsedCartInfo?.customerName,
          country: parsedCartInfo?.country,
          state: parsedCartInfo?.state,
          city: parsedCartInfo?.city,
          zipcode: parsedCartInfo?.zipcode,
          address: parsedCartInfo?.address,
          invoice_number: `${sessionStorage.getItem(
            SESSION_STORAGE_ITEMS.INVOICE_NUMBER
          )}`,
        };

        //extend payload for corporate purchase
        if (parsedCartInfo?.purchaseCategory === PURCHASE_CATEGORY.CORPORATE) {
          jsonPayloadWebinarOrder = {
            ...jsonPayloadWebinarOrder,
            quantityLive: parsedCartInfo?.liveSessionCount,
            quantityRecording: parsedCartInfo?.recordingSessionCount,
            quantityDigitalDownload: parsedCartInfo?.ddSessionCount,
            quantityTranscript: 0,
            attendees: parsedCartInfo?.participantsDetail,
          };
        }

        const templateMessageData = {
          generatedInvoiceNum: jsonPayloadWebinarOrder.invoice_number,
          generatedDate: invoiceFormattedToday,
        };

        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.PURCHASE_SUCCESS_MESSAGE,
          JSON.stringify(templateMessageData)
        );
        setPaymentSuccessMessageData(templateMessageData);

        const formDataPayload = jsonToFormData(
          jsonPayloadWebinarOrder,
          FORM_DATA_OPTIONS
        );

        try {
          let response: any;
          if (
            parsedCartInfo?.purchaseCategory === PURCHASE_CATEGORY.CORPORATE
          ) {
            response = await OrderService.createOrderCorporate(formDataPayload);
          } else {
            response = await OrderService.createOrder(formDataPayload);
          }

          if (validatePostRequest(response)) {
            clearLocalAndSessionStorage();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const createNewsletterOrder = async () => {
    const cartData = localStorage.getItem(LOCAL_STORAGE_ITEMS.CART_DATA);
    const paymentSuccessInfo = localStorage?.getItem(
      LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS
    );

    if (cartData) {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm: any = today.getMonth() + 1;
      let dd: any = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const invoiceFormattedToday = dd + "/" + mm + "/" + yyyy;

      const parsedCartInfo = JSON.parse(cartData);

      if (paymentSuccessInfo) {
        const parsedPaymentSuccessInfo = JSON.parse(paymentSuccessInfo);

        const jsonPayloadNewsletterOrder = {
          customeremail: parsedCartInfo?.email,
          paymentstatus: PAYMENT_STATUS.PURCHASED,
          topic: parsedCartInfo?.topic,
          orderamount: parsedCartInfo?.cartTotal,
          billingemail: parsedPaymentSuccessInfo?.email,
          customername: parsedCartInfo?.customerName,
          country: parsedCartInfo?.country,
          zipcode: parsedCartInfo?.zipcode,
          order_datetimezone: parsedPaymentSuccessInfo?.date_time,
          invoice_number: `${sessionStorage.getItem(
            SESSION_STORAGE_ITEMS.INVOICE_NUMBER
          )}`,
        };

        const templateMessageData = {
          generatedInvoiceNum: jsonPayloadNewsletterOrder.invoice_number,
          generatedDate: invoiceFormattedToday,
        };

        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.PURCHASE_SUCCESS_MESSAGE,
          JSON.stringify(templateMessageData)
        );

        setPaymentSuccessMessageData(templateMessageData);

        const formDataPayload = jsonToFormData(
          jsonPayloadNewsletterOrder,
          FORM_DATA_OPTIONS
        );

        try {
          const response = await OrderService.createNewsletterOrder(
            formDataPayload
          );
          if (validatePostRequest(response)) {
            clearLocalAndSessionStorage();
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  /*--------------------------Event Handlers-------------------------*/

  const onGotoDashboard = () => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_SUCCESS_MESSAGE);
      if (parsedUserInfo?.role?.attendee)
        navigate(`${LINK_ATTENDEE_DASHBOARD}`);
      else if (parsedUserInfo?.role?.speaker)
        navigate(`${LINK_SPEAKER_DASHBOARD}`);
    }
  };

  const redirectToDashboard = () => {
    setTimeout(onGotoDashboard, 3000);
  };

  return (
    <AuthValidator>
      <div className="page-margin">
        <div className="p-5 w-full h-screen flex flex-col gap-2 items-center justify-start">
          <div className="text-2xl">
            <h4 className="font-bold  text-blue-400 text-xl">
              Order Confirmation
            </h4>
          </div>

          <div className="max-w-[500px] font-normal text-sm text-left leading-6">
            <p>
              Thank you for placing an order with HCProfs. We are pleased to
              confirm the receipt of your order
              <strong>{` #${
                paymentSuccessMessageData?.generatedInvoiceNum ?? ""
              } `}</strong>
              ,
              <strong>
                {` dated ${paymentSuccessMessageData?.generatedDate ?? ""}`}.
              </strong>
              <br />
              We appreciate the trust you have placed in us and aim to provide
              you with the highest quality of service. If you have any questions
              or need further assistance, please do not hesitate to contact our
              customer service team at cs@hcprofs.com or +1-830-256-0384.
              <br />
              We value your business and look forward to serving you again. A
              confirmation email has been sent to your registered email.
              <br />
              Thank you for choosing HCProfs. <br /> Warm regards,
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-1 cursor-pointer">
            <ButtonCustom
              className="px-4 py-2 border rounded-full bg-primary-bg-purple text-white"
              label={"Go to dashboard"}
              handleClick={onGotoDashboard}
            />
          </div> */}
        </div>
      </div>
    </AuthValidator>
  );
};

export default PageConfirmPayment;
