import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthValidator from "../../components/AuthValidator";
import { HEALTH_PROFS } from "../../constant";
import { LINK_PAGE_WEBINAR_LISTING } from "../../routes";
import WebinarService from "../../services/WebinarService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";

function PageAttendeeRecommendations() {
  const navigate = useNavigate();
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [
    attendeeDashboardRecommendations,
    setAttendeeDashboardRecommendations,
  ] = useState([]);

  useEffect(() => {
    const onMount = async () => {
      await getAllWebinars();
    };
    onMount();
  }, []);

  /*--------------------Service Calls----------------- */
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

  const onClickRecommendation = (webinarId: string) => {
    navigate(LINK_PAGE_WEBINAR_LISTING + "/" + webinarId);
  };

  return (
    <AuthValidator>
      <div className="w-full p-5 flex flex-col text-sm">
        <h4 className="font-semibold text-2xl text-primary-pLabel">
          Recommendations
        </h4>

        {loadingRecommendations ? (
          <div className="flex-grow flex items-center justify-center">
            <span>
              <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
            </span>
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
      </div>
    </AuthValidator>
  );
}

export default PageAttendeeRecommendations;
