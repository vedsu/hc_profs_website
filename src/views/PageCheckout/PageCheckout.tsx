import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import ppLogo from "../../assets/images/PP_favicon.png";
import { loadStripe } from "@stripe/stripe-js";
import { BaseSyntheticEvent, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import ButtonCustom from "../../components/ButtonCustom";
import DialogCustom from "../../components/DialogCustom";
import { ENV_VAR, LOCAL_STORAGE_ITEMS } from "../../constant";
import { LINK_PAGE_CONFIRM_PAYMENT } from "../../routes";
import PaymentService from "../../services/PaymentService";
import {
  getEnvVariableValues,
  validatePostRequest,
} from "../../utils/commonUtils";

const stripePromise = loadStripe(
  getEnvVariableValues(ENV_VAR.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY)
);

const CheckoutForm = (props: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [showPaymentFailure, setShowPaymentFailure] = useState(false);
  const [showPaymentInProgress, setShowPaymentInProgress] = useState(false);

  const { checkoutInfo } = props;

  /*--------------------Event Handlers------------------*/
  const handleStripePay = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    setShowPaymentInProgress(true);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements?.getElement(CardElement);
    if (cardElement) {
      const { token } = await stripe.createToken(cardElement);

      try {
        if (token) {
          const res = await PaymentService.createStripePaymentRequest(
            JSON.stringify({
              stripeToken: token.id,
              amount: checkoutInfo?.amount,
              name: checkoutInfo?.customerName,
              email: checkoutInfo?.email,
              country: checkoutInfo?.country,
            }),
            {
              "Content-Type": "application/json",
            }
          );

          if (validatePostRequest(res)) {
            if (res?.data?.success) {
              setShowPaymentInProgress(false);
              localStorage.setItem(
                LOCAL_STORAGE_ITEMS.PAYMENT_STATUS_SUCCESS,
                JSON.stringify({
                  ...checkoutInfo,
                  date_time: res?.data?.date_time,
                })
              );
              window.location.href = `${
                window.location.origin + LINK_PAGE_CONFIRM_PAYMENT
              }`;
            } else {
              setShowPaymentFailure(true);
              setShowPaymentInProgress(false);
            }
          }
        } else {
          setShowPaymentFailure(true);
          setShowPaymentInProgress(false);
        }
      } catch (error) {
        console.error(error);
        setShowPaymentFailure(true);
        setShowPaymentInProgress(false);
      }
    } else {
      setShowPaymentFailure(true);
      setShowPaymentInProgress(false);
    }
  };

  const onRetry = () => {
    window.location.reload();
  };

  /*--------------------Sectional Renders---------------------------*/

  const renderPaymentFailureDialog = (): ReactNode => {
    return (
      <div className="pt-5 flex flex-col gap-10 items-center">
        <div className="text-sm text-center">
          <p>
            Unfortunately, the payment for this order has failed <br />
            we had an issue processing your payment. <br />
            Don't panic, it happens!
          </p>
        </div>
        <div>
          <ButtonCustom
            className="btn-custom-secondary w-32 px-2 flex gap-2 justify-center text-primary-pLabel border-2 border-primary-light-900 rounded-full bg-primary-bg-mintCream hover:bg-slate-50"
            label={"Retry"}
            handleClickWithLoader={onRetry}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="stripe-gateway-wrapper my-5 p-5">
      <form
        className="my-4 px-5 py-4 flex flex-col items-center justify-center"
        onSubmit={handleStripePay}
      >
        <div className="pp-payment-card-wrapper px-10 pb-12 pt-6 min-w-[400px] border border-primary-light-900 rounded-lg">
          <div className="flex items-center justify-center">
            <img className="w-8 h-8" alt="pp-icon" src={ppLogo} />
            <h4 className="text-primary-bg-teal text-2xl">PharmaProfs</h4>
          </div>

          <div className="mb-10 text-left text-sm text-primary-bg-teal font-bold">
            Complete your payment by filling in the requested information.
          </div>

          <div className="w-full flex flex-col gap-12 items-center">
            <div className="w-full">
              <div className="mb-4 text-left text-sm text-primary-bg-teal font-bold">
                Please enter your card details
              </div>
              <CardElement className="" />
            </div>
            <ButtonCustom
              containerClassName="w-full"
              className="w-full p-2 text-center bg-primary-bg-teal text-primary-pTextLight rounded-md"
              type={"submit"}
              label={`Pay $${props?.checkoutInfo?.amount}`}
              isLoading={showPaymentInProgress}
              labelClassName={`mx-2`}
              disabled={!stripe}
            />
          </div>
        </div>
      </form>

      <DialogCustom
        dialogVisible={showPaymentFailure}
        containerClassName={
          "max-w-fit p-5 border border-primary-light-900 rounded-lg bg-white"
        }
        headerTemplate={
          <h1 className="text-2xl text-primary-error">Payment Failed !</h1>
        }
        headerTemplateClassName={`flex items-center justify-center`}
        bodyTemplate={renderPaymentFailureDialog()}
        onHideDialog={() => {
          if (!showPaymentFailure) return;
          window.location.reload();
          setShowPaymentFailure(false);
        }}
        position="top"
      />
    </div>
  );
};

const PageCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onMount = async () => {
      if (!location?.state) {
        navigate(-1);
      }
    };
    onMount();
  }, [location, navigate]);

  // const options = {
  //   // passing the client secret obtained from the server
  //   clientSecret: location?.state?.clientSecret,
  // };

  return (
    <AuthValidator>
      <div className="page-margin">
        {/* <Elements stripe={stripePromise} options={options}> */}
        <Elements stripe={stripePromise}>
          <CheckoutForm checkoutInfo={location?.state} />
        </Elements>
      </div>
    </AuthValidator>
  );
};

export default PageCheckout;
