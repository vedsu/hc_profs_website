import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccordionCustom from "../components/AccordionCustom";
import AuthValidator from "../components/AuthValidator";
import ButtonCustom from "../components/ButtonCustom";
import CardTemplates from "../components/CardTemplates";
import { CARD_SUGGESTIONS, LOCAL_STORAGE_ITEMS } from "../constant";
import { LINK_ATTENDEE_RECOMMENDATIONS, LINK_USER_HISTORY } from "../routes";
import { ddmmyy } from "../utils/commonUtils";

interface IUserDashboard {
  userInterfaceData: {
    dashboardData: any[];
    accordionTemplateData: any;
    onClickWebinarCardHandler: any;
  };
}

const dashboardInstructionsAttendee = [
  "Live: Access starts 24 hours before the session.",
  "Recording, Digital Download & Transcript: Available 24–48 hours after the live session and accessible for 30 days.",
  "Transcript: Transcripts will be provided alongside any of the above purchases.",
];

const dashboardInstructionsSpeaker = [
  "A link for every virtual live session will be provided alongside instructions 24 hours before the session begins.",
];

const dashboardNavs = [
  { title: "History", navigateTo: LINK_USER_HISTORY },
  { title: "Recommendations", navigateTo: LINK_ATTENDEE_RECOMMENDATIONS },
];

const UserDashboardLayout = (props: IUserDashboard) => {
  const { dashboardData, accordionTemplateData, onClickWebinarCardHandler } =
    props.userInterfaceData;

  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState<any>({});
  const [isRoleSpeaker, setIsRoleSpeaker] = useState(false);
  const [userInstructions, setUserInstructions] = useState<string[]>([]);
  const [showCardContinuePurchase, setShowCardContinuePurchase] =
    useState(false);
  const [continuePurchaseCardData, setContinuePurchaseCardData] =
    useState<any>(null);

  //prepare data
  const webinarData = dashboardData?.filter((data) => data?.webinar);
  const newsletterData = dashboardData?.filter((data) => data?.newsletter);

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
                  cardCategory: cardItem?.purchaseItem,
                };
              }
            })
            ?.filter((cardInfo) => cardInfo);
          setShowCardContinuePurchase(true);
          setContinuePurchaseCardData(cardsToDisplay);
        }
        setProfileInfo(parsedUserInfo);
      }
    };
    onMount();
  }, []);

  /*-----------------Sectional Renders-----------------------*/

  const renderNewsletterCards = (data: any) => {
    return (
      <div key={Math.random().toString(36)?.substring(2, 8)}>
        <div className="p-3 card-scale flex flex-col gap-2 border-2 text-sm rounded-md">
          <h4 className="max-w-fit px-2 font-semibold border rounded-full bg-primary-bg-teal text-white">
            Newsletter
          </h4>
          <div>
            <span className="font-semibold">Topic : </span>
            <span className="font-medium">{data?.newsletter ?? "N.A."}</span>
          </div>

          <div className="col-span-1">
            <span className="font-semibold">Published Date : </span>
            <span className="">{ddmmyy(data?.published_date) ?? "N.A."}</span>
          </div>

          <div className="w-full flex flex-col gap-5 sm:flex-row items-center justify-between">
            <div className="w-full sm:max-w-fit">
              <ButtonCustom
                className="w-full py-1 px-2 font-semibold text-sm border border-primary-light-900 rounded-full bg-primary-bg-interactiveBlue text-primary-light-200"
                handleClick={() => {
                  window.open(data?.newsletter_doc, "_blank");
                }}
                label={"Download Newsletter"}
              >
                <i className="mx-1 pi pi-book text-sm"></i>
              </ButtonCustom>
            </div>
            <div className="w-full sm:max-w-fit">
              <ButtonCustom
                className="w-full py-1 px-2 font-semibold text-sm"
                handleClick={() => {
                  window.location.href = data?.document;
                }}
                label={"Download Receipt"}
              >
                <i className="mx-1 pi pi-download text-sm"></i>
              </ButtonCustom>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWebinarCards = (data: any) => {
    if (data?.sessionLive && isRoleSpeaker) {
      return (
        <div
          key={Math.random().toString(36)?.substring(2, 8)}
          onClick={onClickWebinarCardHandler}
        >
          <div className="p-3 card-scale flex flex-col gap-2 border-2 text-sm rounded-md">
            <h4 className="max-w-fit px-2 font-semibold border rounded-full bg-primary-bg-lightCyan text-white">
              Webinar
            </h4>
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
                <span className="font-semibold">Live URL: </span>
                <a className="text-blue-500" href={data?.urlLive}>
                  {/* {data?.urlLive ?? ""} */}
                  Click Here
                </a>
              </div>
            ) : null}
          </div>
        </div>
      );
    }
    if (!isRoleSpeaker) {
      return (
        <div
          key={Math.random().toString(36)?.substring(2, 8)}
          onClick={onClickWebinarCardHandler}
        >
          <div className="p-3 card-scale flex flex-col gap-2 border-2 text-sm rounded-md">
            <h4 className="max-w-fit px-2 font-semibold border rounded-full bg-primary-bg-lightCyan text-white">
              Webinar
            </h4>
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

            <React.Fragment>
              {data?.live_url ? (
                <div>
                  <span className="font-semibold">Live URL: </span>
                  <a className="text-blue-500" href={data?.live_url}>
                    {/* {data?.live_url ?? ""} */}
                    Click Here
                  </a>
                </div>
              ) : null}

              {data?.recording_url ? (
                <div>
                  <span className="font-semibold">Recording: </span>
                  <a className="text-blue-500" href={data?.recording_url}>
                    {/* {data?.recording_url ?? ""} */}
                    Click Here
                  </a>
                </div>
              ) : null}

              {data?.digitaldownload_url ? (
                <div>
                  <span className="font-semibold">Digital Download: </span>
                  <a className="text-blue-500" href={data?.digitaldownload_url}>
                    {/* {data?.digitaldownload_url ?? ""} */}
                    Click Here
                  </a>
                </div>
              ) : null}

              {data?.transcript_url ? (
                <div>
                  <span className="font-semibold">Transcript: </span>
                  <a className="text-blue-500" href={data?.transcript_url}>
                    {/* {data?.transcript_url ?? ""} */}
                    Click Here
                  </a>
                </div>
              ) : null}

              <div className="w-full flex justify-end">
                <ButtonCustom
                  className="py-1 px-2 max-w-fit font-semibold text-sm"
                  handleClick={() => {
                    window.location.href = data?.document;
                  }}
                  label={"Download Receipt"}
                >
                  <i className="mx-1 pi pi-download text-sm"></i>
                </ButtonCustom>
              </div>
            </React.Fragment>
          </div>
        </div>
      );
    }
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
                    setShowCardContinuePurchase(false);
                  }
                  setContinuePurchaseCardData(filteredCardsInfo);
                }}
              />
            </div>
          ) : null}

          <div className="dashboard-navs">
            <div className="w-full flex items-center justify-start">
              <div className="pb-3 px-4 font-normal text-sm">
                <div>
                  <span className="mr-1 font-semibold">Name:</span>
                  <span>{profileInfo?.name ?? "N.A"}</span>
                </div>
                <div>
                  <span className="mr-1 font-semibold">Email:</span>
                  <span>{profileInfo?.email ?? "N.A"}</span>
                </div>
                <div>
                  <span className="mr-1 font-semibold">Role:</span>
                  <span>{profileInfo?.jobProfile ?? "N.A"}</span>
                </div>
                <div>
                  <span className="mr-1 font-semibold">Contact:</span>
                  <span>{profileInfo?.contact ?? "N.A"}</span>
                </div>
              </div>
            </div>

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
                ? "For any queries, please contact Brian at brian@profstraining.com"
                : "For any queries, please contact the Webinar Team at cs@hcprofs.com."}
            </p>
          </div>

          <div className="user-webinar-list py-4 flex flex-col gap-4">
            {newsletterData?.length
              ? newsletterData?.map((data) => {
                  return renderNewsletterCards(data);
                })
              : null}
          </div>

          {webinarData?.length ? (
            <div className="user-webinar-list flex flex-col gap-4">
              {webinarData?.map((data) => {
                return renderWebinarCards(data);
              })}
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
