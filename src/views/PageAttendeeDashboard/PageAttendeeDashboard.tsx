import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HEALTH_PROFS, LOCAL_STORAGE_ITEMS, USER_ROLE } from "../../constant";
import UserDashboardLayout from "../../layout/UserDashboard";
import { LINK_PAGE_WEBINAR_LISTING } from "../../routes";
import DashboardService from "../../services/DashboardService";
import WebinarService from "../../services/WebinarService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";

const PageAttendeeDashboard = () => {
  const navigate = useNavigate();

  const [attendeeDashboardData, setAttendeeDashboardInfo] = useState<any[]>([]);
  const [
    attendeeDashboardHistoryPurchased,
    setAttendeeDashboardHistoryPurchased,
  ] = useState([]);
  const [attendeeDashboardHistoryPending, setAttendeeDashboardHistoryPending] =
    useState([]);
  const [
    attendeeDashboardNewsletterPurchased,
    setAttendeeDashboardNewsletterPurchased,
  ] = useState([]);
  const [
    attendeeDashboardRecommendations,
    setAttendeeDashboardRecommendations,
  ] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const accordionTemplateData = [
    {
      title: "History",
      description: (
        <React.Fragment>
          {attendeeDashboardHistoryPurchased?.length ? (
            <div className="px-2 flex flex-col gap-5">
              <div>
                <div className="my-2 text-left font-semibold text-sm">
                  <div className="px-2">{`Purchased newsletter(s)`}</div>
                </div>
                <ul className="text-sm font-normal">
                  {attendeeDashboardNewsletterPurchased?.map(
                    (newsletterPurchased: any, idx: number) => (
                      <li key={idx + 1} className="my-2 px-2">
                        <span>◈ {newsletterPurchased}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div>
                <div className="my-2 text-left font-semibold text-sm">
                  <div className="px-2">{`Purchased webinar(s)`}</div>
                </div>
                <ul className="text-sm font-normal">
                  {attendeeDashboardHistoryPurchased?.map(
                    (historyPurchase: any, idx: number) => (
                      <li key={idx + 1} className="my-2 px-2">
                        <span>◈ {historyPurchase}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {attendeeDashboardHistoryPending?.length ? (
                <div>
                  <div className="my-2 text-left font-semibold text-sm">
                    <div className="px-2">{`Pending webinar(s)`}</div>
                  </div>
                  <ul className="text-sm font-normal">
                    {attendeeDashboardHistoryPending?.map(
                      (historyPending: any, idx: number) => (
                        <li key={idx + 1} className="my-2 px-2">
                          <span>◈ {historyPending}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-sm font-normal">
              <p className="my-2 px-2 text-center">Nothing to show here.</p>
            </div>
          )}
        </React.Fragment>
      ),
    },
    {
      title: "Recommendations",
      description: (
        <React.Fragment>
          {loadingRecommendations ? (
            <div className="h-32 flex items-center justify-center">
              <i className="pi pi-spin pi-spinner text-base"></i>
            </div>
          ) : (
            <React.Fragment>
              {attendeeDashboardRecommendations?.length ? (
                <div className="mb-2 text-sm font-normal cursor-pointer">
                  {attendeeDashboardRecommendations?.map(
                    (recommendation: any) => (
                      <div
                        key={recommendation?.webinarId}
                        onClick={() =>
                          onClickRecommendation(recommendation?.webinarId)
                        }
                      >
                        <div className="card-scale card-scale-bg my-2 p-4 border-2 border-primary-light-900 rounded-lg flex flex-col gap-1 text-sm">
                          <div>
                            <span className="font-bold">
                              {recommendation?.topic}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold">{"Industry : "}</span>
                            <span>
                              {getInitialLetterUpperCase(
                                recommendation?.industry
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold">
                              {"Duration : "} {`${recommendation?.duration}`}
                            </span>
                            <span className="mx-1">minutes</span>
                          </div>
                          <div>
                            <span className="font-bold">{"Date : "}</span>
                            <span>{monDayYear(recommendation?.date)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-sm font-normal">
                  <p className="my-2 px-2 text-center">Nothing to show here.</p>
                </div>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      ),
    },
  ];

  useEffect(() => {
    const onMount = async () => {
      await getAttendeeDashBoardInfo();
      await getAllWebinars();
    };
    onMount();
  }, []);

  /*--------------------Service Calls----------------- */
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
          //webinar and newsletter info
          setAttendeeDashboardInfo([...res?.data?.[0], ...res?.data?.[3]]);
          //other necessary information
          setAttendeeDashboardHistoryPending(res?.data?.[1]);
          setAttendeeDashboardHistoryPurchased(res?.data?.[2]);
          setAttendeeDashboardNewsletterPurchased(res?.data[4]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getAllWebinars = async () => {
    try {
      const res = await WebinarService.getWebinars();
      if (validateGetRequest(res)) {
        const currDate = new Date();
        const upcomingWebinarsPharma = res?.data?.[0]?.filter(
          (webinar: any) =>
            webinar?.website === HEALTH_PROFS.WEBSITE &&
            new Date(webinar?.date) > currDate
        );

        const recommendations = upcomingWebinarsPharma.map((webinar: any) => {
          return {
            topic: webinar?.topic,
            duration: webinar?.duration,
            industry: webinar?.industry,
            date: webinar?.date,
            webinarUrl: webinar?.webinar_url,
            webinarId: webinar?.id,
          };
        });
        setAttendeeDashboardRecommendations(recommendations);
        setLoadingRecommendations(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*----------------------Events Handlers-------------------*/
  const onClickListCard = () => {
    //
  };

  const onClickRecommendation = (webinarId: string) => {
    navigate(LINK_PAGE_WEBINAR_LISTING + "/" + webinarId);
  };

  /*-------------------Main Render------------------------*/

  return (
    <UserDashboardLayout
      userInterfaceData={{
        dashboardData: attendeeDashboardData,
        onClickWebinarCardHandler: onClickListCard,
        accordionTemplateData: accordionTemplateData,
      }}
    />
  );
};

export default PageAttendeeDashboard;
