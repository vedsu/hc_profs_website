import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonCustom from "../components/ButtonCustom";
import {
  HEALTH_PROFS,
  WEBINAR_CATEGORIES,
  WEBINAR_SESSIONS,
} from "../constant";
import { LINK_PAGE_WEBINAR_LISTING } from "../routes";
import WebinarService from "../services/WebinarService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../utils/commonUtils";

const webinarEventOptions = [
  {
    label: "Live",
    value: WEBINAR_SESSIONS.LIVE,
  },
  {
    label: "Recording",
    value: WEBINAR_SESSIONS.RECORDING,
  },
  {
    label: "All",
    value: WEBINAR_SESSIONS.ALL,
  },
];

const PageWebinarList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = decodeURIComponent(location?.search);

  const [isLoadingWebinars, setIsLoadingWebinars] = React.useState(true);
  const [webinarsList, setWebinarsList] = React.useState([]);
  const [filteredWebinarsList, setFilteredWebinarsList] = React.useState([]);
  const [isListView, setIsListView] = React.useState(false);
  const [webinarCategoriesList, setWebinarCategoriesList] = React.useState([]);
  const [webinarCategory, setWebinarCategory] = React.useState("");
  const [webinarSession, setWebinarSession] = React.useState(
    WEBINAR_SESSIONS.ALL
  );

  const applyFilters = React.useCallback(() => {
    let filteredWebinars: any;
    if (webinarsList?.length) {
      if (webinarSession === WEBINAR_SESSIONS.ALL) {
        filteredWebinars = [...webinarsList];
      } else if (webinarSession === WEBINAR_SESSIONS.LIVE) {
        filteredWebinars = webinarsList?.filter(
          (webinar: any) => webinar?.sessionLive
        );
      } else if (webinarSession === WEBINAR_SESSIONS.RECORDING) {
        filteredWebinars = webinarsList?.filter(
          (webinar: any) => webinar?.sessionRecording
        );
      }

      if (webinarCategory) {
        filteredWebinars = filteredWebinars?.filter(
          (webinar: any) => webinar?.category === webinarCategory
        );
      }
      setFilteredWebinarsList(filteredWebinars);
    }
  }, [webinarsList, webinarCategory, webinarSession]);

  React.useEffect(() => {
    const onMount = async () => {
      await getAllWebinars();
    };
    onMount();
  }, []);

  React.useEffect(() => {
    applyFilters();
  }, [webinarsList, webinarCategory, webinarSession, applyFilters]);

  React.useEffect(() => {
    if (webinarCategoriesList && webinarCategoriesList?.length) {
      let webinarCategory = "";
      if (queryParams?.includes("quality control"))
        webinarCategory = WEBINAR_CATEGORIES.QUALITY_CONTROL;
      else if (queryParams?.includes("quality assurance"))
        webinarCategory = WEBINAR_CATEGORIES.QUALITY_ASSURANCE;
      else if (queryParams?.includes("pharmaceutical automation"))
        webinarCategory = WEBINAR_CATEGORIES.PHARMACEUTICAL_AUTOMATION;
      else if (queryParams?.includes("medical device"))
        webinarCategory = WEBINAR_CATEGORIES.MEDICAL_DEVICE;
      else if (queryParams?.includes("manufacturing"))
        webinarCategory = WEBINAR_CATEGORIES.MANUFACTURING_COMPLIANCE;
      else if (queryParams?.includes("research and development"))
        webinarCategory = WEBINAR_CATEGORIES.RESEARCH_DEVELOPMENT;
      else if (queryParams?.includes("regulatory affairs"))
        webinarCategory = WEBINAR_CATEGORIES.REGULATORY_AFFAIRS;
      else if (queryParams?.includes("regulatory compliance"))
        webinarCategory = WEBINAR_CATEGORIES.REGULATORY_COMPLIANCE;
      else if (queryParams?.includes("supply chain"))
        webinarCategory = WEBINAR_CATEGORIES.SUPPLY_CHAIN_WAREHOUSING;

      setWebinarCategory(webinarCategory);
    }
  }, [queryParams, webinarCategoriesList]);

  React.useEffect(() => {
    if (queryParams?.includes("courses")) {
      let session = "";
      if (queryParams?.includes("all")) session = WEBINAR_SESSIONS.ALL;
      else if (queryParams?.includes("live")) session = WEBINAR_SESSIONS.LIVE;
      else if (queryParams?.includes("recording"))
        session = WEBINAR_SESSIONS.RECORDING;

      setWebinarSession(session);
    }
  }, [queryParams]);

  /*---------------------------Service Calls------------------------------*/
  const getAllWebinars = async () => {
    try {
      const res = await WebinarService.getWebinars();
      if (validateGetRequest(res)) {
        const webinarsPharma = res?.data?.[0]?.filter(
          (webinar: any) => webinar?.website === HEALTH_PROFS.WEBSITE
        );
        const webinarCategories: any = [];
        webinarsPharma.forEach((webinar: any) => {
          if (webinar?.category) {
            if (
              webinarCategories?.find(
                (currentCategory: any) =>
                  currentCategory.value === webinar?.category
              )
            )
              return;
            else {
              webinarCategories.push({
                label: getInitialLetterUpperCase(webinar?.category),
                value: webinar?.category,
              });
            }
          }
        });

        setWebinarsList(webinarsPharma);
        setFilteredWebinarsList(webinarsPharma);
        setWebinarCategoriesList(webinarCategories);
        setIsLoadingWebinars(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*-----------------Event Handlers----------------------------- */
  const handleWebinarCategoryChange = (e: DropdownChangeEvent) => {
    setWebinarCategory(e.value);
  };

  const handleSessionChange = (e: DropdownChangeEvent) => {
    setWebinarSession(e.value);
  };

  /*------------------------Sectional Renders--------------------*/
  const renderListView = (): ReactNode => {
    return (
      <div className="w-full flex flex-col gap-5">
        {filteredWebinarsList.map((webinar: any) => {
          return (
            <div
              key={Math.random().toString(36).substring(2)}
              onClick={() => {
                navigate(LINK_PAGE_WEBINAR_LISTING + "/" + webinar?.id);
              }}
            >
              <div
                className={
                  "card-scale card-scale-bg border border-primary-light-900 flex items-center justify-between cursor-pointer"
                }
              >
                <div className="p-3 flex flex-col gap-3">
                  <div className="text-left font-semibold text-sm">
                    <div>{webinar?.topic ?? "N.A."}</div>
                  </div>

                  <div className="flex flex-wrap items-center justify-start gap-2 text-primary-pSlateGray text-sm">
                    <div>
                      <span className="font-bold mr-1">Date :</span>
                      <span>{monDayYear(webinar?.date) ?? "N.A"}</span>
                    </div>
                    <span>{"|"}</span>

                    {webinarSession !== WEBINAR_SESSIONS.RECORDING && (
                      <React.Fragment>
                        <div>
                          <span className="font-bold mx-1">Time :</span>
                          <span>
                            {webinar?.time ?? "N.A"}{" "}
                            {webinar?.timeZone ?? "N.A"}
                          </span>
                        </div>
                        <span>{"|"}</span>
                      </React.Fragment>
                    )}

                    <div>
                      <span className="font-bold mx-1">Duration :</span>
                      <span>{webinar?.duration ?? "N.A"} minutes</span>
                    </div>
                    <span>{"|"}</span>

                    <div>
                      <span className="font-bold mx-1">Industry :</span>
                      <span>
                        {getInitialLetterUpperCase(webinar?.industry ?? "N.A")}
                      </span>
                    </div>
                    <span>{"|"}</span>

                    <div>
                      <span className="font-bold mx-1">Category :</span>
                      <span>
                        {getInitialLetterUpperCase(webinar?.category ?? "N.A")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderGridView = (): ReactNode => {
    return (
      <div className="w-full my-5 grid grid-cols-1 md:grid-cols-2 screen_var_one:grid-cols-3 auto-rows-fr gap-5">
        {filteredWebinarsList.map((webinar: any) => {
          return (
            <div
              key={Math.random().toString(36).substring(2)}
              onClick={() => {
                navigate(LINK_PAGE_WEBINAR_LISTING + "/" + webinar?.id);
              }}
            >
              <div
                className={`card-scale card-scale-bg col-span-1 h-full border-2 border-primary-light-900 flex flex-col items-start justify-between cursor-pointer`}
              >
                <div className="grid-card-title text-sm text-left font-medium">
                  <div>{webinar.topic ?? "N.A."}</div>
                </div>

                <div className="w-full p-3">
                  <div className="mb-5 flex items-center justify-between font-medium text-xs">
                    <span>
                      {getInitialLetterUpperCase(webinar?.category ?? "N.A")}
                    </span>
                    <span>
                      {getInitialLetterUpperCase(webinar?.industry ?? "N.A")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-medium text-xs">
                    <span>
                      {getInitialLetterUpperCase(webinar?.speaker ?? "N.A")}
                    </span>
                    <span>{webinar?.duration ?? "N.A"} minutes</span>
                  </div>
                </div>

                <div className="p-3 w-full flex gap-3 flex-wrap items-center justify-between bg-secondary-sBlue text-primary-light-200">
                  <div className="text-xs">
                    <span>{monDayYear(webinar?.date) ?? "N.A"}</span>
                    <span className="mx-1">
                      {webinar?.time ?? "N.A"} {webinar?.timeZone ?? "N.A"}
                    </span>
                  </div>

                  <div>
                    <ButtonCustom
                      className="px-2 py-1 bg-white border rounded-full text-primary-pText font-semibold text-xs"
                      label={"Read More"}
                      handleClick={() => {
                        navigate(
                          `${LINK_PAGE_WEBINAR_LISTING + webinar?.webinar_url}`
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
    );
  };

  return (
    <div className="webinar-wrapper px-5 py-10 flex flex-col gap-5 ">
      <div className="w-full flex items-center justify-center">
        <InputText
          className="px-2 py-2 w-full min-w-64 screen_var_one:w-1/2 border border-primary-light-900 outline-none"
          placeholder="Search Webinar..."
        />
      </div>

      <div className="flex gap-10 items-center justify-start">
        <div className="text-secondary-sLabel">
          <Button
            className={`px-2 py-1 w-20 font-semibold text-xs justify-center border-primary-light-900 rounded-full bg-primary-bg-limedSpruce text-primary-light-200 ${
              isListView ? "!bg-secondary-sBlue !text-secondary-sLabel " : ""
            }`}
            onClick={() => setIsListView(true)}
          >
            <i className="pi pi-list text-xl"></i>
          </Button>
        </div>
        <div className="text-secondary-sLabel">
          <Button
            className={`px-2 py-1 w-20 font-semibold text-xs justify-center border-primary-light-900 rounded-full bg-primary-bg-limedSpruce text-primary-light-200 ${
              !isListView ? "!bg-secondary-sBlue !text-secondary-sLabel" : ""
            }`}
            onClick={() => setIsListView(false)}
          >
            <i className={`pi pi-table text-xl`}></i>
          </Button>
        </div>
      </div>

      <div className="px-1 py-5 sm:p-5 border border-primary-light-900 webinar-list-wrapper">
        <div className="px-2 mb-5 flex flex-col gap-5 screen_var_one:flex-row screen_var_one:justify-between">
          <div className="w-full flex">
            <div className="w-full screen_var_one:w-64">
              <Dropdown
                className="px-2 py-2 w-full border text-gray-500 text-xs"
                placeholder="Select category"
                optionLabel="label"
                optionValue="value"
                options={webinarCategoriesList}
                value={webinarCategory}
                onChange={handleWebinarCategoryChange}
              />
            </div>

            {webinarCategory && (
              <button
                className="mx-2 w-24 border rounded-full p-1 bg-gray-50 text-xs font-semibold hover:bg-gray-100"
                onClick={() => {
                  setWebinarCategory("");
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="w-full screen_var_one:w-24">
            <Dropdown
              className="px-2 py-2 w-full border text-gray-500 text-xs drop-web-session"
              placeholder="Sessions"
              optionLabel="label"
              optionValue="value"
              options={webinarEventOptions}
              value={webinarSession}
              onChange={handleSessionChange}
            />
          </div>
        </div>

        <div className="px-2 max-h-[1200px] overflow-auto">
          {isLoadingWebinars ? (
            <div className="h-[400px] flex items-center justify-center">
              <span>
                <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
              </span>
            </div>
          ) : (
            <React.Fragment>
              {filteredWebinarsList?.length ? (
                <React.Fragment>
                  {isListView ? renderListView() : renderGridView()}
                </React.Fragment>
              ) : (
                <div className="w-full h-64 text-center">
                  <div className="text-xs">No webinars found</div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageWebinarList;
