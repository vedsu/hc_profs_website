import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import InterfaceError from "./components/InterfaceError";
import InterfaceLoader from "./components/InterfaceLoader";

export const LINK_HOME = "/";
export const LINK_PAGE_WEBINAR_LISTING = "/webinars";
export const LINK_PAGE_LOGIN_REG = "/login-reg";
export const LINK_PAGE_SPEAKERS = "/speakers";
export const LINK_PAGE_SPEAKER_OPPORTUNITY = "/speaker-opportunity";
export const LINK_PAGE_RESOURCES = "/resources";
export const LINK_PAGE_NEWSLETTERS = LINK_PAGE_RESOURCES + "/newsletters";
export const LINK_PAGE_ABOUT_US = "/about-us";
export const LINK_PAGE_FAQ = "/faq";
export const LINK_PAGE_CONTACT_US = "/contact-us";
export const LINK_PAGE_PRIVACY_POLICY = "/privacy-policy";
export const LINK_PAGE_TERMS_AND_CONDITIONS = "/terms-and-conditions";
export const LINK_PAGE_REFUND_AND_CANCELLATION = "/refund-cancellation";
export const LINK_PAGE_FORGOT_PASSWORD = "/forgot-password";

/*-----------------------Payment-------------------------------------*/
export const LINK_PAGE_CART = "/cart";
export const LINK_PAGE_CHECKOUT = "/stripe-checkout";
export const LINK_PAGE_CONFIRM_PAYMENT = "/confirm-payment";

/*--------------------User Dashboard------------------- */
export const LINK_BASE_DASHBOARD = "/dashboard";
export const LINK_ATTENDEE_DASHBOARD = LINK_BASE_DASHBOARD + "/attendee";
export const LINK_SPEAKER_DASHBOARD = LINK_BASE_DASHBOARD + "/speaker";
export const LINK_ATTENDEE_RECOMMENDATIONS =
  LINK_BASE_DASHBOARD + "/recommendations";
export const LINK_USER_HISTORY = LINK_BASE_DASHBOARD + "/history";

/*---------------------Unauthorized Page-------------------------*/
export const LINK_UNAUTHORIZED_DASHBOARD =
  LINK_BASE_DASHBOARD + "/unauthorized";

/*-----------------Code Splitting using Dynamic Imports----------- */
const PPWebsite = lazy(() => import("./layout/HCPWebsite"));
const PageLoginOrRegister = lazy(
  () => import("./views/auth/PageLoginOrRegister")
);

const PageHome = lazy(() => import("./views/PageHome"));
const PageWebinarList = lazy(() => import("./views/PageWebinarList"));
const PageWebinarInfo = lazy(() => import("./views/PageWebinarInfo"));
const PageSpeakers = lazy(() => import("./views/PageSpeakers"));
const PageSpeakerInfo = lazy(() => import("./views/PageSpeakerInfo"));
const PageSpeakerOpportunity = lazy(
  () => import("./views/PageSpeakerOpportunity")
);
const PageNewsletters = lazy(() => import("./views/PageNewsletters"));
const PageNewsletterInfo = lazy(() => import("./views/PageNewsletterInfo"));
const PageAboutUs = lazy(() => import("./views/PageAboutUs"));
const PageFAQ = lazy(() => import("./views/PageFAQ"));
const PageContactUs = lazy(() => import("./views/PageContactUs"));
const PagePrivacyPolicy = lazy(() => import("./views/PagePrivacyPolicy"));
const PageTermsAndConditions = lazy(
  () => import("./views/PageTermsAndConditions")
);
const PageRefundCancellation = lazy(
  () => import("./views/PageRefundCancellation")
);
const PageSpeakerDashboard = lazy(() => import("./views/PageSpeakerDashboard"));
const PageAttendeeDashboard = lazy(
  () => import("./views/PageAttendeeDashboard")
);
const PageUserHistory = lazy(() => import("./views/PageUserHistory"));
const PageAttendeeRecommendations = lazy(
  () => import("./views/PageAttendeeRecommendations")
);

const PageCart = lazy(() => import("./views/PageCart"));
const PageCheckout = lazy(() => import("./views/PageCheckout"));
const PageConfirmPayment = lazy(() => import("./views/PageConfirmPayment"));
const PageForgotPassword = lazy(() => import("./views/PageForgotPassword"));
const PageUnauthorized = lazy(() => import("./views/PageUnauthorized"));

const ppWebsiteChildrenRoutes = [
  {
    path: LINK_HOME,
    element: <PageHome />,
  },
  {
    path: LINK_PAGE_WEBINAR_LISTING,
    element: <PageWebinarList />,
  },
  {
    path: `${LINK_PAGE_WEBINAR_LISTING}/:webinar`,
    element: <PageWebinarInfo />,
  },
  {
    path: LINK_PAGE_SPEAKERS,
    element: <PageSpeakers />,
  },
  {
    path: `${LINK_PAGE_SPEAKERS}/:speakerId`,
    element: <PageSpeakerInfo />,
  },
  {
    path: LINK_PAGE_SPEAKER_OPPORTUNITY,
    element: <PageSpeakerOpportunity />,
  },
  {
    path: LINK_PAGE_LOGIN_REG,
    element: <PageLoginOrRegister />,
  },
  {
    path: LINK_PAGE_NEWSLETTERS,
    element: <PageNewsletters />,
  },
  {
    path: `${LINK_PAGE_NEWSLETTERS}/:newsletterId`,
    element: <PageNewsletterInfo />,
  },
  {
    path: LINK_PAGE_ABOUT_US,
    element: <PageAboutUs />,
  },
  {
    path: LINK_PAGE_FAQ,
    element: <PageFAQ />,
  },
  {
    path: LINK_PAGE_CONTACT_US,
    element: <PageContactUs />,
  },
  {
    path: LINK_PAGE_PRIVACY_POLICY,
    element: <PagePrivacyPolicy />,
  },
  {
    path: LINK_PAGE_TERMS_AND_CONDITIONS,
    element: <PageTermsAndConditions />,
  },
  {
    path: LINK_PAGE_REFUND_AND_CANCELLATION,
    element: <PageRefundCancellation />,
  },
  {
    path: LINK_SPEAKER_DASHBOARD,
    element: <PageSpeakerDashboard />,
  },
  {
    path: LINK_ATTENDEE_DASHBOARD,
    element: <PageAttendeeDashboard />,
  },
  {
    path: LINK_USER_HISTORY,
    element: <PageUserHistory />,
  },
  {
    path: LINK_ATTENDEE_RECOMMENDATIONS,
    element: <PageAttendeeRecommendations />,
  },
  {
    path: LINK_PAGE_CART,
    element: <PageCart />,
  },
  {
    path: LINK_PAGE_CHECKOUT,
    element: <PageCheckout />,
  },
  {
    path: LINK_PAGE_CONFIRM_PAYMENT,
    element: <PageConfirmPayment />,
  },
  {
    path: LINK_PAGE_FORGOT_PASSWORD,
    element: <PageForgotPassword />,
  },
  {
    path: LINK_UNAUTHORIZED_DASHBOARD,
    element: <PageUnauthorized />,
  },
];

const ppWebsiteRoutes: RouteObject[] = [
  {
    path: LINK_HOME,
    element: (
      <Suspense fallback={<InterfaceLoader />}>
        <PPWebsite />
      </Suspense>
    ),
    children: ppWebsiteChildrenRoutes,
    errorElement: <InterfaceError />,
  },
];

export default ppWebsiteRoutes;
