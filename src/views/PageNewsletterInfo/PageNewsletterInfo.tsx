import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import NewsletterService from "../../services/NewsletterService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";

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
        "/" + params?.newsletterId
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

  /*--------------------------Event Handlers-----------------*/

  const onBuyNow = async () => {};

  /*---------------------Sectional Renders------------------*/
  const renderNewsletterInfo = (): ReactNode => {
    return (
      <div className="p-5 w-full flex flex-col gap-6 screen_var_one:p-0">
        <div className="w-full h-[300px] flex items-center justify-center font-semibold text-xs">
          <img
            className="w-full h-full object-cover"
            src={newsletterData?.thumbnail}
            alt="newsletter-thumbnail"
          />
        </div>

        <div className="w-full sm:w-[300px] self-end">
          <ButtonCustom
            className="w-full h-8 py-2 bg-primary-bg-interactiveBlue font-semibold text-sm text-white rounded-full leading-3 hover:bg-primary-bg-interactiveBlueHover"
            label={"Buy Now"}
            handleClickWithLoader={onBuyNow}
          />
        </div>

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

        <div className="flex flex-col gap-1 text-left text-sm">
          <div className="w-full font-semibold">{"Description : "}</div>
          <p className="w-full ">{newsletterData?.description ?? "N.A."}</p>
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
