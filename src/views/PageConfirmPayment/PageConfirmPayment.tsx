import jsonToFormData from "json-form-data";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import ButtonCustom from "../../components/ButtonCustom";
import {
  FORM_DATA_OPTIONS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
  HEALTH_PROFS,
} from "../../constant";
import { LINK_ATTENDEE_DASHBOARD, LINK_SPEAKER_DASHBOARD } from "../../routes";
import OrderService from "../../services/OrderService";
import { validatePostRequest } from "../../utils/commonUtils";

const initialMessageData = {
  generatedInvoiceNum: "",
  generatedInvoiceDate: "",
};

const PageConfirmPayment = () => {
  const navigate = useNavigate();

  const [paymentSuccessMessageData, setPaymentSuccessMessageData] =
    useState<any>({ ...initialMessageData });

  /*---------------------------Service Calls------------------------------*/
  const createWebinarOrder = useCallback(async () => {
    const cartData = localStorage.getItem(LOCAL_STORAGE_ITEMS.CART_DATA);
    const paymentSuccessInfo = localStorage.getItem(
      LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS
    );
    const purchaseSuccessMessage = localStorage.getItem(
      LOCAL_STORAGE_ITEMS.PURCHASE_SUCCESS_MESSAGE
    );

    if (purchaseSuccessMessage) {
      setPaymentSuccessMessageData(JSON.parse(purchaseSuccessMessage));
    }

    if (cartData && paymentSuccessInfo) {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm: any = today.getMonth() + 1;
      let dd: any = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const formattedToday = dd + mm + yyyy;
      const invoiceFormattedToday = dd + "/" + mm + "/" + yyyy;

      const parsedCartInfo = JSON.parse(cartData);
      const parsedPaymentSuccessInfo = JSON.parse(paymentSuccessInfo);

      const jsonPayload = {
        customeremail: parsedCartInfo?.email,
        paymentstatus: PAYMENT_STATUS.PURCHASED,
        billingemail: parsedPaymentSuccessInfo?.email,
        website: HEALTH_PROFS.WEBSITE,
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
        sessionTranscript: parsedCartInfo?.webinarSessionTranscript,
        priceTranscript: parsedCartInfo?.priceTranscript,
        customername: parsedCartInfo?.customerName,
        country: parsedCartInfo?.country,
        state: parsedCartInfo?.state,
        city: parsedCartInfo?.city,
        zipcode: parsedCartInfo?.zipcode,
        address: parsedCartInfo?.address,
        invoice_number: `${formattedToday}_PP_${
          Math.random().toString(36).substring(2)?.toUpperCase() +
          Math.random().toString(36).substring(2)?.toUpperCase()
        }`,
      };

      const templateMessageData = {
        generatedInvoiceNum: jsonPayload.invoice_number,
        generatedDate: invoiceFormattedToday,
      };

      localStorage.setItem(
        LOCAL_STORAGE_ITEMS.PURCHASE_SUCCESS_MESSAGE,
        JSON.stringify(templateMessageData)
      );
      setPaymentSuccessMessageData(templateMessageData);

      const formDataPayload = jsonToFormData(jsonPayload, FORM_DATA_OPTIONS);

      try {
        const response = await OrderService.createOrder(formDataPayload);
        if (validatePostRequest(response)) {
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.PURCHASE_INFO);
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.CART_DATA);
          localStorage.removeItem(LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    const onMount = async () => {
      await createWebinarOrder();
    };

    onMount();
  }, [createWebinarOrder]);

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

  return (
    <AuthValidator>
      <div className="page-margin">
        <div className="py-5 w-full h-screen flex flex-col gap-2 items-center justify-start">
          <div className="text-2xl">
            <h4 className="font-bold text-xl text-primary-bg-teal">
              Your payment was successful !
            </h4>
          </div>

          <div className="max-w-fit-content flex gap-5 font-semibold text-sm text-left leading-8">
            <p>
              Thank you for placing an order with PharmaProfs. We are pleased to
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
              customer service team at [customer service email address] or
              [customer service phone number].
              <br />
              Thank you for choosing PharmaProfs.
              <br />
              We value your business and look forward to serving you again. A
              confirmation email has been sent to your registered email.
              <br />
              Warm regards,
            </p>
          </div>

          <div className="flex flex-wrap gap-1 cursor-pointer">
            <ButtonCustom
              className="px-4 py-2 border rounded-full bg-primary-bg-lightTeal text-white"
              label={"Go to dashboard"}
              handleClick={onGotoDashboard}
            />
          </div>
        </div>
      </div>
    </AuthValidator>
  );
};

export default PageConfirmPayment;
