import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccordionCustom from "../components/AccordionCustom";
import AuthValidator from "../components/AuthValidator";
import ButtonCustom from "../components/ButtonCustom";
import CardTemplates from "../components/CardTemplates";
import { CARD_SUGGESTIONS, LOCAL_STORAGE_ITEMS } from "../constant";
import { LINK_ATTENDEE_RECOMMENDATIONS, LINK_USER_HISTORY } from "../routes";

interface IUserDashboard {
  userInterfaceData: {
    webinarData: any[];
    accordionTemplateData: any;
    onClickWebinarCardHandler: any;
  };
}

const dashboardInstructionsAttendee = [
  "Live Webinar Training: A real-time virtual webinar link and instructions will be provided 24 hours before each session.",
  "Recorded Webinar: A pre-recorded event available for 30 days. The recording will be sent 24-48 hours after the live session concludes.",
  "Digital Download: A file available for download, accessible for 30 days. It will be provided 3-7 working days after the live session.",
  "Transcript: A written form of the webinar, including participant questions and presenter comments, available for 30 days.",
  "It will be sent within 3-7 working days after the live session.",
];

const dashboardInstructionsSpeaker = [
  "A link for every virtual live session will be provided alongside instructions 24 hours before the session begins. ",
];

const dashboardNavs = [
  { title: "Recommendations", navigateTo: LINK_ATTENDEE_RECOMMENDATIONS },
  { title: "History", navigateTo: LINK_USER_HISTORY },
];

const UserDashboardLayout = (props: IUserDashboard) => {
  const { webinarData, accordionTemplateData, onClickWebinarCardHandler } =
    props.userInterfaceData;

  const [isRoleSpeaker, setIsRoleSpeaker] = useState(false);
  const [userInstructions, setUserInstructions] = useState<string[]>([]);
  const [showCardContinuePurchase, setShowCardContinuePurchase] =
    useState(false);
  const [continuePurchaseCardData, setContinuePurchaseCardData] =
    useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const onMount = async () => {
      const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);
      const cardContinuePurchaseInfoWebinar = localStorage.getItem(
        LOCAL_STORAGE_ITEMS.CARD_CONTINUE_PURCHASE
      );
      const cardContinuePurchaseInfoNewsletter = localStorage.getItem(
        LOCAL_STORAGE_ITEMS.CARD_CONTINUE_PURCHASE_NEWSLETTER
      );

      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        setIsRoleSpeaker(parsedUserInfo?.role?.speaker ? true : false);

        if (parsedUserInfo?.role?.speaker) {
          setUserInstructions(dashboardInstructionsSpeaker);
        } else if (parsedUserInfo?.role?.attendee) {
          setUserInstructions(dashboardInstructionsAttendee);
        }

        const parsedCardContinuePurchaseInfoWebinar =
          cardContinuePurchaseInfoWebinar
            ? JSON.parse(cardContinuePurchaseInfoWebinar)
            : null;

        const parsedCardContinuePurchaseInfoNewsletter =
          cardContinuePurchaseInfoNewsletter
            ? JSON.parse(cardContinuePurchaseInfoNewsletter)
            : null;

        const continuePurchaseCardsList = [
          parsedCardContinuePurchaseInfoWebinar,
          parsedCardContinuePurchaseInfoNewsletter,
        ];

        if (
          parsedUserInfo?.role?.attendee &&
          (parsedCardContinuePurchaseInfoWebinar ||
            parsedCardContinuePurchaseInfoNewsletter)
        ) {
          const cardsToDisplay = continuePurchaseCardsList
            ?.map((cardItem) => {
              if (cardItem) {
                return {
                  id: cardItem?.id,
                  title: cardItem?.topic,
                  cardCategory: cardItem?.purchaseType,
                };
              }
            })
            ?.filter((cardInfo) => cardInfo);
          setShowCardContinuePurchase(true);
          setContinuePurchaseCardData(cardsToDisplay);
        }
      }
    };
    onMount();
  }, []);
  /*-----------------Sectional Renders-----------------------*/
  const renderWebinarCards = (data: any) => {
    return (
      <div
        key={Math.random().toString(36)?.substring(2, 8)}
        className=""
        onClick={onClickWebinarCardHandler}
      >
        <div className="p-3 card-scale flex flex-col gap-2 border-2 text-sm rounded-md cursor-pointer">
          <div>
            <span className="font-semibold">Topic : </span>
            <span className="font-medium">{data?.webinar ?? "N.A."}</span>
          </div>

          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <span className="font-semibold">Duration : </span>
              <span className="">
                {Number(data?.duration ?? "N.A.")} minutes
              </span>
            </div>
            <div className="col-span-1">
              <span className="font-semibold">Date : </span>
              <span className="">{data?.date ?? "N.A."}</span>
            </div>
            <div className="col-span-1">
              <span className="font-semibold">Time : </span>
              <span className="">{`${data?.time ?? "-"} ${
                data?.timeZone ?? "-"
              }`}</span>
            </div>
          </div>

          {data?.sessionLive && isRoleSpeaker ? (
            <div>
              <span className="font-semibold">Live URL : </span>
              <a className="text-blue-500" href={data?.urlLive}>
                {data?.urlLive ?? ""}
              </a>
            </div>
          ) : null}

          {!isRoleSpeaker && (
            <React.Fragment>
              {data?.live_url ? (
                <div>
                  <span className="font-semibold">Live URL : </span>
                  <a className="text-blue-500" href={data?.live_url}>
                    {data?.live_url ?? ""}
                  </a>
                </div>
              ) : null}

              {data?.recording_url ? (
                <div>
                  <span className="font-semibold">Recording URL : </span>
                  <a className="text-blue-500" href={data?.recording_url}>
                    {data?.recording_url ?? ""}
                  </a>
                </div>
              ) : null}

              {data?.digitaldownload_url ? (
                <div>
                  <span className="font-semibold">DD URL : </span>
                  <a className="text-blue-500" href={data?.digitaldownload_url}>
                    {data?.digitaldownload_url ?? ""}
                  </a>
                </div>
              ) : null}

              {data?.transcript_url ? (
                <div>
                  <span className="font-semibold">Transcript URL : </span>
                  <a className="text-blue-500" href={data?.transcript_url}>
                    {data?.transcript_url ?? ""}
                  </a>
                </div>
              ) : null}

              <div>
                <ButtonCustom
                  className="py-1 px-2 max-w-fit font-semibold text-sm bg-primary-bg-lightCyan rounded-full"
                  handleClick={() => {
                    window.location.href = data?.document;
                  }}
                  label={"Download Receipt"}
                >
                  <i className="mx-1 pi pi-download text-sm"></i>
                </ButtonCustom>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  };

  return (
    <AuthValidator>
      <div className="user-dash-layout">
        <div className="user-dash-webinars">
          {showCardContinuePurchase ? (
            <div className="mb-5 relative border border-primary-light-900 bg-transparent rounded-lg">
              <CardTemplates
                variant={CARD_SUGGESTIONS.CONTINUE_PURCHASE}
                cardData={continuePurchaseCardData}
                callBack={(clickedCardItem: any) => {
                  const filteredCardsInfo = continuePurchaseCardData?.filter(
                    (cardItem: any) => cardItem?.id !== clickedCardItem?.id
                  );
                  if (!filteredCardsInfo?.length) {
                    debugger;
                    setShowCardContinuePurchase(false);
                  }
                  setContinuePurchaseCardData(filteredCardsInfo);
                }}
              />
            </div>
          ) : null}

          <div className="dashboard-navs">
            <div className="text-sm text-primary-pText">
              {dashboardNavs?.map((navItem, idx) => (
                <button
                  key={idx + 1}
                  className="mb-5 p-3 inline-block w-full border-2 border-primary-light-900 rounded-full text-left cursor-pointer"
                  onClick={() => navigate(navItem.navigateTo)}
                >
                  {navItem.title}
                </button>
              ))}
            </div>
          </div>

          {webinarData?.length ? (
            <div className="user-webinar-list flex flex-col gap-4">
              <React.Fragment>
                <div className="w-full p-6 border border-primary-light-900 rounded-lg">
                  <h4 className="font-bold text-xl">INSTRUCTIONS :</h4>
                  <ol className="list-decimal">
                    {userInstructions?.map((instruction, idx) => (
                      <li key={`${idx + 1}`} className="my-2 font-bold text-sm">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 font-bold text-sm">
                    {isRoleSpeaker
                      ? "For any queries, please contact Brian at brian@pharmaprofs.com"
                      : "For any queries, please contact the Webinar Team at support@pharmaprofs.com."}
                  </p>
                </div>

                {webinarData.map((data) => {
                  return renderWebinarCards(data);
                })}
              </React.Fragment>
            </div>
          ) : (
            <div className="w-full h-screen flex items-center justify-center relative">
              <h4 className="font-bold text-xl">No webinars to show.</h4>
            </div>
          )}
        </div>

        <aside className="side-menu-wrapper">
          <section className="py-2">
            <span className="inline-block w-full">
              <AccordionCustom
                accordionData={accordionTemplateData}
                accordionClassName={"flex flex-col gap-5"}
                accordionHeaderClassName={"border-2 p-4 rounded-full"}
                accordionTabClassName={"text-primary-pLabel font-semibold"}
                activeIndex={1}
              />
            </span>
          </section>
        </aside>
      </div>
    </AuthValidator>
  );
};

export default UserDashboardLayout;
