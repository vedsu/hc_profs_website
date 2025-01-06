import jsonToFormData from "json-form-data";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import {
  FORM_DATA_OPTIONS,
  LOCAL_STORAGE_ITEMS,
  PAYMENT_STATUS,
  SESSION_STORAGE_ITEMS,
  USER_ROLE,
} from "../../constant";
import {
  LINK_PAGE_CART,
  LINK_PAGE_CONFIRM_PAYMENT,
  LINK_PAGE_LOGIN_REG,
} from "../../routes";
import DashboardService from "../../services/DashboardService";
import NewsletterService from "../../services/NewsletterService";
import OrderService from "../../services/OrderService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
  validatePostRequest,
} from "../../utils/commonUtils";
import { PURCHASE_ITEM } from "../PageCart/PageCart";

const PageNewsletterInfo = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(true);
  const [newsletterData, setNewsletterData] = useState<any>(null);

  /*------------------------useEffect----------------------------*/
  useEffect(() => {
    const onMount = async () => {
      await getNewsletterDetails();
    };
    onMount();
  }, []);

  /*---------------------------Service Calls------------------------------*/
  const getNewsletterDetails = async () => {
    try {
      const response = await NewsletterService.getNewsletterById(
        params?.newsletterId
      );
      if (validateGetRequest(response)) {
        const newsletter = response?.data;
        // newsletter info
        if (newsletter) {
          setNewsletterData(newsletter);
          setIsLoadingNewsletter(false);
        } else {
          setNewsletterData({});
          setIsLoadingNewsletter(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAttendeeDashBoardInfo = async () => {
    const userDataFromLocalStorage = localStorage.getItem(
      LOCAL_STORAGE_ITEMS.USERINFO
    );

    if (userDataFromLocalStorage) {
      const userInfo = JSON.parse(userDataFromLocalStorage);
      const path = "/" + `${userInfo.email}` + "/" + USER_ROLE.ATTENDEE;
      try {
        const res = await DashboardService.getUserDashboardInfo(path);
        if (validateGetRequest(res)) {
          //return the purchased webinar info
          return res?.data?.[3];
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  /*--------------------------Event Handlers-----------------*/
  const onReadNow = async () => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo?.role?.speaker) {
        alert("Please register as an Attendee");
        return;
      }
    }

    if (userInfo && parseInt(newsletterData?.price, 10) > 0) {    
      const isNewsletterPurchased = await getAttendeeNewsletterList();
      if (!isNewsletterPurchased) {
        navigate(`${LINK_PAGE_CART}?purchase-item=newsletter`);
        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.PURCHASE_INFO_NEWSLETTER,
          JSON.stringify({
            ...newsletterData,
            newsletterId: params?.newsletterId,
            cartTotal: parseInt(newsletterData?.price, 10),
          })
        );
      }
    } else if (userInfo && parseInt(newsletterData?.price, 10) === 0) {
      const isNewsletterPurchased = await getAttendeeNewsletterList();
      if (!isNewsletterPurchased) {
        const today = new Date();
        const yyyy = today.getFullYear() % 100;
        let mm: any = today.getMonth() + 1;
        let dd: any = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        const formattedToday = dd + mm + yyyy;
        const invoiceFormattedToday = dd + "/" + mm + "/" + yyyy;

        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo) {
          const jsonPayloadNewsletterOrder = {
            customeremail: parsedUserInfo?.email,
            paymentstatus: PAYMENT_STATUS.PURCHASED,
            topic: newsletterData?.topic,
            orderamount: 0,
            billingemail: parsedUserInfo?.email,
            customername: null,
            country: null,
            order_datetimezone: new Date(),
            invoice_number: `${formattedToday}_HCP_${Math.random()
              .toString(36)
              .substring(2, 10)
              ?.toUpperCase()}`,
          };

          localStorage.setItem(
            LOCAL_STORAGE_ITEMS.PURCHASE_INFO_FREE_NEWSLETTER,
            JSON.stringify({
              generatedInvoiceNum: jsonPayloadNewsletterOrder.invoice_number,
              generatedDate: invoiceFormattedToday,
            })
          );

          const formDataPayload = jsonToFormData(
            jsonPayloadNewsletterOrder,
            FORM_DATA_OPTIONS
          );

          try {
            const response = await OrderService.createNewsletterOrder(
              formDataPayload
            );
            if (validatePostRequest(response)) {
              navigate(LINK_PAGE_CONFIRM_PAYMENT);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    } else {
      sessionStorage.setItem(
        SESSION_STORAGE_ITEMS.REG_BANNER,
        JSON.stringify({
          display: true,
        })
      );

      localStorage.setItem(
        LOCAL_STORAGE_ITEMS.CARD_CONTINUE_PURCHASE_NEWSLETTER,
        JSON.stringify({
          display: true,
          id: newsletterData?.id,
          topic: newsletterData?.topic,
          purchaseItem: PURCHASE_ITEM.NEWSLETTER,
        })
      );

      navigate(LINK_PAGE_LOGIN_REG, {
        state: {
          showRegCheckOutBanner: true,
        },
      });
    }
  };

  const getAttendeeNewsletterList = async () => {
    let isNewsletterPurchased: any;
    const list = await getAttendeeDashBoardInfo();
    isNewsletterPurchased = list?.find(
      (newsletter: any) => newsletter?.w_id === newsletterData?.id
    );
    if (isNewsletterPurchased) {
      alert("You have already purchased this newsletter");
    }
    return isNewsletterPurchased;
  };

  /*---------------------Sectional Renders------------------*/
  const renderNewsletterInfo = (): ReactNode => {
    return (
      <div className="p-5 w-full flex flex-col gap-6 screen_var_one:p-0">
        <div className="flex flex-col-reverse items-start screen_var_one:flex-row screen_var_one:justify-between">
          <div className="flex-grow flex flex-col gap-5">
            <div className="text-left font-semibold">
              <div>
                {getInitialLetterUpperCase(newsletterData?.topic) ?? "N.A."}
              </div>
            </div>
            <div className="text-left text-sm">
              <span className="font-semibold">{"Category : "}</span>
              <span>
                {getInitialLetterUpperCase(newsletterData?.category) ?? "N.A."}
              </span>
            </div>
            <div className="text-left text-sm">
              <span className="font-semibold">{"Price : "}</span>
              <span>
                {newsletterData?.price ? `$${newsletterData?.price}` : "-"}
              </span>
            </div>
            <div className="text-left text-sm">
              <span className="font-semibold">{"Published Date : "}</span>
              <span>{monDayYear(newsletterData?.published_at) ?? "N.A."}</span>
            </div>

            <div className="w-full sm:w-[300px] self-start">
              <ButtonCustom
                className="w-full h-8 py-2 bg-primary-bg-interactiveBlue font-semibold text-sm text-white rounded-full leading-3 hover:bg-primary-bg-interactiveBlueHover"
                label={"Read Now"}
                handleClickWithLoader={onReadNow}
              />
            </div>
          </div>

          <div className="w-full sm:w-[500px] h-[300px] flex items-center justify-center font-semibold text-xs">
            <img
              className="w-full h-full object-fill"
              src={newsletterData?.thumbnail}
              alt="newsletter-thumbnail"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-left text-sm">
          <div className="w-full font-semibold">{"Description : "}</div>
          <p className="w-full">{newsletterData?.description ?? "N.A."}</p>
        </div>
      </div>
    );
  };

  /*-------------------Main Render------------------------- */
  return (
    <section className="my-10 px-2 py-5 border border-primary-light-900 webinarInfo-container sm:p-5">
      <div className="w-full flex flex-col items-center justify-center gap-5">
        {isLoadingNewsletter ? (
          <div className="h-[400px] flex items-center justify-center">
            <span>
              <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
            </span>
          </div>
        ) : (
          <React.Fragment>
            <div className="w-full flex flex-col items-center justify-center">
              {renderNewsletterInfo()}
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default PageNewsletterInfo;
