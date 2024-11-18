export const ENV_VAR = {
  VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY:
    "VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY",
  VITE_ORDER_FORM_URL: "VITE_ORDER_FORM_URL",
};

export const primeReactConfigOptions = {
  //   hideOverlaysOnDocumentScrolling: true,
  cssTransition: true, // for in-built prime react component animations
  ripple: true,
  zIndex: {
    modal: 1100, // dialog, sidebar
    overlay: 1000, // dropdown, overlay panel
    menu: 1000, // overlay menus
    tooltip: 1100, // tooltip
    toast: 1200, // toast
  },
  autoZIndex: false,
};

export const HEALTH_PROFS = {
  HEALTHCARE: "HEALTHCARE",
  WEBSITE: "HEALTHPROFS",
};

export const WEBINAR_SESSIONS = {
  LIVE: "LIVE",
  RECORDING: "RECORDING",
  ALL: "ALL",
};

export const WEBINAR_CATEGORIES = {
  NURSING: "NURSING",
  HEALTHCARE_MANAGEMENT: "HEALTHCARE MANAGEMENT",
  MEDICAL_BILLING_AND_CODING: "Medical Billing and Coding",
  HIPAA_AND_COMPLIANCE: "HIPAA AND COMPLIANCE",
  E_M_SERVICES: "E/M SERVICES",
  HOSPITAL_AND_COMPLIANCE: "HOSPITAL AND COMPLIANCE",
  HOSPICE_AND_HOME_CARE: "HOSPICE AND HOME CARE",
  CMS_COMPLIANCE: "CMS COMPLIANCE",
  CPT_ICD_UPDATES: "CPT/ICD UPDATES",
};

export const USER_ROLE = {
  SPEAKER: "Speaker",
  ATTENDEE: "Attendee",
};

export const SUBSCRIPTION_TYPE = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
};

export const CARD_SUGGESTIONS = {
  CONTINUE_PURCHASE: "continuePurchaseAfterReg",
  CONTINUE_PURCHASE_NEWSLETTER: "continuePurchaseNewsletterAfterReg",
};

export const LOCAL_STORAGE_ITEMS = {
  USERINFO: "userInfo",
  CARD_CONTINUE_PURCHASE: CARD_SUGGESTIONS.CONTINUE_PURCHASE,
  CARD_CONTINUE_PURCHASE_NEWSLETTER:
    CARD_SUGGESTIONS.CONTINUE_PURCHASE_NEWSLETTER,
  PURCHASE_INFO: "purchaseWebinarInfo",
  PURCHASE_INFO_NEWSLETTER: "purchaseNewsletterInfo",
  PURCHASE_INFO_FREE_NEWSLETTER: "purchaseFreeNewsletterInfo",
  CART_DATA: "cartDataInfo",
  PAYMENT_STATUS_SUCCESS: "paymentSuccessInfo",
  PURCHASE_SUCCESS_MESSAGE: "purchaseSuccessMessageInfo",
};

export const SESSION_STORAGE_ITEMS = {
  REG_BANNER: "regBanner",
};

export const FORM_DATA_OPTIONS = {
  // initialFormData: new FormData(),
  showLeafArrayIndexes: true,
  includeNullValues: false,
  mapping: function (value: any) {
    if (typeof value === "boolean") {
      return +value ? true : false;
    }
    return value;
  },
};

export const PURCHASE_CATEGORY = {
  INDIVIDUAL: "INDIVIDUAL",
  CORPORATE: "CORPORATE",
};

export const PAYMENT_STATUS = {
  PURCHASED: "purchased",
  PENDING: "pending",
};

export const COUPON_TYPE = {
  BY_PERCENTAGE: "per",
  BY_AMOUNT: "dollar",
};

export const COUPON_MESSAGE = {
  SUCCESS: "success",
  INVALID: "invalid",
};

export const COUPON_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};
