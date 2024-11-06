import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import { LINK_PAGE_NEWSLETTERS } from "../../routes";
import NewsletterService from "../../services/NewsletterService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";

const PageNewsletters = () => {
  const navigate = useNavigate();

  const [isLoadingNewsletters, setIsLoadingNewsletters] = React.useState(true);
  const [newslettersList, setNewslettersList] = React.useState([]);

  useEffect(() => {
    const onMount = async () => {
      await getAllNewsletters();
    };
    onMount();
  }, []);

  /*---------------------------Service Calls------------------------------*/
  const getAllNewsletters = async () => {
    try {
      const res = await NewsletterService.getNewsletters();
      if (validateGetRequest(res)) {
        const newslettersHCProfs = res?.data;
        setNewslettersList(newslettersHCProfs);
        setIsLoadingNewsletters(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="newsletter-wrapper px-5 py-10 flex flex-col gap-5 ">
      <div className="px-3 py-5 sm:p-5 border border-primary-light-900 newsletter-list-wrapper">
        <div>
          {isLoadingNewsletters ? (
            <div className="h-[400px] flex items-center justify-center">
              <span>
                <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
              </span>
            </div>
          ) : (
            <React.Fragment>
              {newslettersList?.length ? (
                <React.Fragment>
                  <div className="w-full my-5 grid grid-cols-1 gap-5 md:grid-cols-2 screen_var_one:grid-cols-3 xl:grid-cols-4 auto-rows-fr ">
                    {newslettersList?.map((newsletter: any) => {
                      return (
                        <div
                          key={Math.random().toString(36).substring(2)}
                          onClick={() => {
                            navigate(
                              LINK_PAGE_NEWSLETTERS + "/" + newsletter?.id
                            );
                          }}
                        >
                          <div
                            className={`card-scale card-scale-bg col-span-1 h-full border-2 border-primary-light-900 flex flex-col cursor-pointer`}
                          >
                            <div className="grid-card-title text-sm text-left font-semibold">
                              <div>{newsletter.topic ?? "N.A."}</div>
                            </div>

                            <div className="flex-grow flex items-center justify-center text-xs">
                              <img
                                className="w-full h-full object-fill"
                                src={newsletter?.thumbnail}
                                alt="newsletter-image"
                              />
                            </div>

                            <div className="w-full px-2 py-1">
                              <div className="mb-2 text-xs">
                                <span className="font-semibold">
                                  {`Category : ${
                                    getInitialLetterUpperCase(
                                      newsletter?.category
                                    ) ?? "N.A"
                                  }`}
                                </span>
                              </div>

                              <div className="text-xs">
                                <span className="font-semibold">
                                  {`Price : $${newsletter?.price ?? "N.A"}`}
                                </span>
                              </div>
                            </div>

                            <div className="p-2 w-full flex flex-col gap-2 bg-secondary-sBlue text-primary-light-200">
                              <div className="w-full text-sm">
                                <span>
                                  {monDayYear(newsletter?.published_at) ??
                                    "N.A"}
                                </span>
                              </div>

                              <div className="w-full font-normal text-sm">
                                {newsletter?.description}
                              </div>

                              <div className="w-full">
                                <ButtonCustom
                                  className="w-full px-4 py-1 bg-white border  text-primary-pText font-semibold text-xs"
                                  label={"Read More"}
                                  handleClick={() => {
                                    navigate(
                                      `${
                                        LINK_PAGE_NEWSLETTERS + newsletter?.id
                                      }`
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ) : (
                <div className="w-full h-64 text-center">
                  <div className="text-xs">No newsletter found</div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageNewsletters;
