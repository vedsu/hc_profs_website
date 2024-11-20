import React, {
  BaseSyntheticEvent,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import {
  HEALTH_PROFS,
  LOCAL_STORAGE_ITEMS,
  PURCHASE_CATEGORY,
  SESSION_STORAGE_ITEMS,
  USER_ROLE,
} from "../../constant";
import {
  LINK_PAGE_CART,
  LINK_PAGE_LOGIN_REG,
  LINK_PAGE_REFUND_AND_CANCELLATION,
} from "../../routes";
import DashboardService from "../../services/DashboardService";
import WebinarService from "../../services/WebinarService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";
import { PURCHASE_ITEM } from "../PageCart/PageCart";

const initialPurchaseData = {
  webinarSessionLive: false,
  webinarSessionRecording: false,
  webinarSessionDD: false,
};

const initialCorporatePurchaseInfo = {
  liveSessionCount: 1,
  recordingSessionCount: 1,
  ddSessionCount: 1,
};

const PageWebinarInfo: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoadingWebinar, setIsLoadingWebinar] = useState(true);
  const [activeTabId, setActiveTabId] = useState("individual-tab");
  const [isWebinarAlreadyPurchased, setIsWebinarAlreadyPurchased] =
    useState(false);
  const [showCartEmptyMessage, setShowCartEmptyMessage] = useState(false);
  const [webinarData, setWebinarData] = useState<any>(null);
  const [speakerData, setSpeakerData] = useState<any>(null);
  const [corporatePurchaseTypeInfo, setCorporatePurchaseTypeInfo] = useState(
    initialCorporatePurchaseInfo
  );
  const [purchaseData, setPurchaseData] = useState(initialPurchaseData);
  const [cartTotal, setCartTotal] = useState(0);

  /*---------------------------Service Calls------------------------------*/
  const getWebinarDetails = useCallback(async () => {
    try {
      const res1 = await WebinarService.getWebinarById(params?.webinar);
      if (validateGetRequest(res1)) {
        const webinar = res1?.data;
        // webinar info
        if (webinar) {
          setWebinarData(webinar);
          setIsLoadingWebinar(false);
        } else {
          setWebinarData({});
          setIsLoadingWebinar(false);
        }
        const res2 = await WebinarService.getWebinars();
        if (validateGetRequest(res2)) {
          const webinarSpeaker = res2?.data?.[1]?.find((speaker: any) => {
            return (
              speaker?.industry?.toUpperCase() === HEALTH_PROFS.HEALTHCARE &&
              speaker?.name === webinar?.speaker
            );
          });
          //speaker info
          if (webinarSpeaker) {
            setSpeakerData(webinarSpeaker);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [params?.webinar]);

  /*------------------------useEffect----------------------------*/
  useEffect(() => {
    const onMount = async () => {
      await getWebinarDetails();
    };
    onMount();
  }, [getWebinarDetails]);

  useEffect(() => {
    let amt = 0;
    const isLiveChecked = (
      document.getElementById("checkbox-buy-live") as HTMLInputElement
    )?.checked;
    const isRecordingChecked = (
      document.getElementById("checkbox-buy-recording") as HTMLInputElement
    )?.checked;
    const isDDChecked = (
      document.getElementById("checkbox-buy-dd") as HTMLInputElement
    )?.checked;

    const livePrice = Number(webinarData?.priceLive ?? "0");
    const recordingPrice = Number(webinarData?.priceRecording ?? "0");
    const ddPrice = Number(webinarData?.priceDigitalDownload ?? "0");

    if (isLiveChecked)
      amt += livePrice * corporatePurchaseTypeInfo.liveSessionCount;
    if (isRecordingChecked)
      amt += recordingPrice * corporatePurchaseTypeInfo.recordingSessionCount;
    if (isDDChecked) amt += ddPrice * corporatePurchaseTypeInfo.ddSessionCount;

    setCartTotal(amt);
    setPurchaseData({
      webinarSessionLive: Number(livePrice) ? true : false,
      webinarSessionRecording: Number(recordingPrice) ? true : false,
      webinarSessionDD: Number(ddPrice) ? true : false,
    });
    setShowCartEmptyMessage(false);
  }, [
    corporatePurchaseTypeInfo.liveSessionCount,
    corporatePurchaseTypeInfo.recordingSessionCount,
    corporatePurchaseTypeInfo.ddSessionCount,
  ]);

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
          return res?.data?.[0];
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  /*--------------------------Event Handlers-----------------*/
  const onTabClick = (event: BaseSyntheticEvent) => {
    setActiveTabId(event.target?.id ?? "");
    setCorporatePurchaseTypeInfo(initialCorporatePurchaseInfo);
  };

  const handlePurchaseInput = () => {
    let amt = 0;
    const isLiveChecked = (
      document.getElementById("checkbox-buy-live") as HTMLInputElement
    )?.checked;
    const isRecordingChecked = (
      document.getElementById("checkbox-buy-recording") as HTMLInputElement
    )?.checked;
    const isDDChecked = (
      document.getElementById("checkbox-buy-dd") as HTMLInputElement
    )?.checked;

    const livePrice = Number(webinarData?.priceLive ?? "0");
    const recordingPrice = Number(webinarData?.priceRecording ?? "0");
    const ddPrice = Number(webinarData?.priceDigitalDownload ?? "0");

    if (isLiveChecked)
      amt += livePrice * corporatePurchaseTypeInfo.liveSessionCount;
    if (isRecordingChecked)
      amt += recordingPrice * corporatePurchaseTypeInfo.recordingSessionCount;
    if (isDDChecked) amt += ddPrice * corporatePurchaseTypeInfo.ddSessionCount;

    setCartTotal(amt);
    setPurchaseData({
      webinarSessionLive: Number(livePrice) ? true : false,
      webinarSessionRecording: Number(recordingPrice) ? true : false,
      webinarSessionDD: Number(ddPrice) ? true : false,
    });
    setShowCartEmptyMessage(false);
  };

  const handleCorporatePurchaseQuantities = (event: BaseSyntheticEvent) => {
    setCorporatePurchaseTypeInfo((prev) => ({
      ...prev,
      [event.target.name]: parseInt(event.target.value),
    }));
  };

  const onBuyNow = async () => {
    const userInfo = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);

    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      if (parsedUserInfo?.role?.speaker) {
        alert("Please register as an Attendee");
        return;
      }
    }

    if (userInfo && cartTotal > 0) {
      let isWebinarPurchased: any;

      if (activeTabId === "individual-tab") {
        const purchasedList = await getAttendeeDashBoardInfo();
        isWebinarPurchased = purchasedList?.find(
          (purchasedWebinar: any) =>
            purchasedWebinar?.w_id === webinarData?.id &&
            purchasedWebinar?.total_attendee === null
        );
      }

      if (!isWebinarPurchased) {
        navigate(`${LINK_PAGE_CART}?purchase-item=webinar`);
        localStorage.setItem(
          LOCAL_STORAGE_ITEMS.PURCHASE_INFO,
          JSON.stringify({
            ...purchaseData,
            ...(activeTabId === "corporate-tab"
              ? {
                  purchaseCategory: PURCHASE_CATEGORY.CORPORATE,
                  ...corporatePurchaseTypeInfo,
                }
              : {}),
            webinarId: params?.webinar,
            cartTotal: cartTotal,
          })
        );
      } else {
        alert("You have already purchased this webinar.");
        setIsWebinarAlreadyPurchased(true);
        setActiveTabId("corporate-tab");
      }
    } else if (userInfo && cartTotal === 0) {
      setShowCartEmptyMessage(true);
    } else {
      sessionStorage.setItem(
        SESSION_STORAGE_ITEMS.REG_BANNER,
        JSON.stringify({
          display: true,
        })
      );

      localStorage.setItem(
        LOCAL_STORAGE_ITEMS.CARD_CONTINUE_PURCHASE,
        JSON.stringify({
          display: true,
          id: webinarData?.id,
          topic: webinarData?.topic,
          purchaseItem: PURCHASE_ITEM.WEBINAR,
        })
      );

      localStorage.setItem(
        LOCAL_STORAGE_ITEMS.PURCHASE_INFO,
        JSON.stringify({
          ...purchaseData,
          ...(activeTabId === "corporate-tab"
            ? {
                purchaseCategory: PURCHASE_CATEGORY.CORPORATE,
                ...corporatePurchaseTypeInfo,
              }
            : {}),
          webinarId: params?.webinar,
          cartTotal: cartTotal,
        })
      );

      navigate(LINK_PAGE_LOGIN_REG, {
        state: {
          showRegCheckOutBanner: true,
        },
      });
    }
  };

  /*---------------------Sectional Renders------------------*/

  const renderWebinarInfo = (): ReactNode => {
    return (
      <>
        <div className="w-full flex flex-col justify-between screen_var_one:flex-row">
          <div className="w-full screen_var_one:min-w-[50%] flex flex-col gap-5 items-start justify-start">
            <div className="w-full flex items-center justify-start text-xs">
              <img
                className="w-28 h-28 rounded-[50%]"
                src={speakerData?.photo}
                alt="speaker-image"
              />
            </div>
            <div>
              <div className="my-2 font-semibold text-xs">
                {getInitialLetterUpperCase(speakerData?.name) ?? "N.A."}
              </div>
            </div>
          </div>
          <div className="w-full screen_var_one:w-[50%] screen_var_one:p-5  flex flex-col gap-2">
            <div className="text-left text-base">
              <span className="font-semibold">{"Industry : "}</span>
              <span>
                {`${
                  getInitialLetterUpperCase(webinarData?.industry) ?? "N.A."
                }`}
              </span>
            </div>
            <div className="text-left text-base">
              <span className="font-semibold">{"Category : "}</span>
              <span>
                {getInitialLetterUpperCase(webinarData?.category) ?? "N.A."}
              </span>
            </div>
            <div className="text-left text-base">
              <span className="font-semibold">{"Date : "}</span>
              <span>{monDayYear(webinarData?.date) ?? "N.A."}</span>
            </div>
            <div className="text-left text-base">
              <span className="font-semibold">{"Time : "}</span>
              <span>
                {`${getInitialLetterUpperCase(webinarData?.time) ?? "N.A."} ${
                  webinarData?.timeZone ?? "N.A."
                }`}
              </span>
            </div>
            <div className="text-left text-base">
              <span className="font-semibold">{"Duration : "}</span>
              <span>
                {`${
                  getInitialLetterUpperCase(webinarData?.duration) ?? "N.A."
                } minutes`}
              </span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderPurchaseDescription = (): ReactNode => {
    return (
      <React.Fragment>
        <div className="w-full flex bg-primary-bg-limedSpruce font-semibold text-base text-white">
          <div className="w-[50%] h-10">
            <button
              id="individual-tab"
              className={`purchase-type-tab w-full h-full ${
                activeTabId === "individual-tab"
                  ? "purchase-type-active-tab"
                  : ""
              }`}
              onClick={onTabClick}
              disabled={isWebinarAlreadyPurchased}
            >
              Individual
            </button>
          </div>
          <div className="w-[50%] h-10">
            <button
              id="corporate-tab"
              className={`purchase-type-tab w-full h-full ${
                activeTabId === "corporate-tab"
                  ? "purchase-type-active-tab"
                  : ""
              }`}
              onClick={onTabClick}
            >
              Corporate
            </button>
          </div>
        </div>

        <div className="webinar-reg-table px-2">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6">{"Session"}</th>
                <th className="text-center">{"Price"}</th>
                {activeTabId === "corporate-tab" ? (
                  <th className="text-center">{"Qty"}</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {webinarData?.sessionLive && (
                <tr>
                  <td>
                    <label
                      htmlFor="checkbox-buy-live"
                      className="webinar-purchase-label"
                    >
                      {"Live  (Inc. Transcript)"}
                      <input
                        id="checkbox-buy-live"
                        type="checkbox"
                        className="buy-webinar-input"
                        onChange={handlePurchaseInput}
                        value={webinarData?.priceLive}
                      />
                      <span className="check-mark"></span>
                    </label>
                  </td>

                  <td>
                    <span className="mr-1">{"$"}</span>
                    {webinarData?.priceLive}
                  </td>

                  {activeTabId === "corporate-tab" ? (
                    <td>
                      <input
                        className="w-12 h-8 px-1 py-2 border border-primary-light-900 outline-none text-sm text-primary-pText"
                        name="liveSessionCount"
                        type="number"
                        min={0}
                        value={corporatePurchaseTypeInfo.liveSessionCount}
                        onChange={handleCorporatePurchaseQuantities}
                      />
                    </td>
                  ) : null}
                </tr>
              )}
              <tr>
                <td>
                  <label
                    htmlFor="checkbox-buy-recording"
                    className="webinar-purchase-label"
                  >
                    {"Recording (Inc. Transcript)"}
                    <input
                      id="checkbox-buy-recording"
                      type="checkbox"
                      className="buy-webinar-input"
                      onChange={handlePurchaseInput}
                    />
                    <span className="check-mark"></span>
                  </label>
                </td>
                <td>
                  <span className="mr-1">{"$"}</span>
                  {webinarData?.priceRecording}
                </td>
                {activeTabId === "corporate-tab" ? (
                  <td>
                    <input
                      className="w-12 h-8 px-1 py-2 border border-primary-light-900 outline-none text-sm text-primary-pText"
                      name="recordingSessionCount"
                      type="number"
                      min={0}
                      value={corporatePurchaseTypeInfo.recordingSessionCount}
                      onChange={handleCorporatePurchaseQuantities}
                    />
                  </td>
                ) : null}
              </tr>
              <tr>
                <td>
                  <label
                    htmlFor="checkbox-buy-dd"
                    className="webinar-purchase-label"
                  >
                    {"Digital Download (Inc. Transcript)"}
                    <input
                      id="checkbox-buy-dd"
                      type="checkbox"
                      className="buy-webinar-input"
                      onChange={handlePurchaseInput}
                    />
                    <span className="check-mark"></span>
                  </label>
                </td>

                <td>
                  <span className="mr-1">{"$"}</span>
                  {webinarData?.priceDigitalDownload}
                </td>

                {activeTabId === "corporate-tab" ? (
                  <td>
                    <input
                      className="w-12 h-8 px-1 py-2 border border-primary-light-900 outline-none text-sm text-primary-pText"
                      name="ddSessionCount"
                      type="number"
                      min={0}
                      value={corporatePurchaseTypeInfo.ddSessionCount}
                      onChange={handleCorporatePurchaseQuantities}
                    />
                  </td>
                ) : null}
              </tr>
            </tbody>
          </table>

          <div className="mt-2 px-6 w-full h-8 flex flex-col items-start justify-center">
            <span className="text-xs font-bold">{"Order Amount"}</span>
            <span className="text-base flex-grow h-8 px-2 font-bold leading-8">
              {`$ ${cartTotal}`}
            </span>
          </div>

          {showCartEmptyMessage ? (
            <div className="my-1 px-6">
              <small className="text-sm text-primary-error">
                {"Webinar session not selected."}
              </small>
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  };

  /*-------------------Main Render------------------------- */
  return (
    <section className="my-10 px-2 py-5 border border-primary-light-900 webinarInfo-container sm:p-5">
      <div className="w-full flex flex-col items-center justify-center gap-5">
        {isLoadingWebinar ? (
          <div className="h-[400px] flex items-center justify-center">
            <span>
              <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
            </span>
          </div>
        ) : (
          <React.Fragment>
            <div className="w-full flex flex-col items-stretch justify-between gap-5 screen_var_one:flex-row screen_var_one:gap-0">
              <div className="px-2 w-full screen_var_one:w-[60%] screen_var_one:px-5 flex flex-col gap-5">
                <div className="mb-4 text-xl text-left font-semibold">
                  <div>{webinarData?.topic ?? "N.A."}</div>
                </div>
                {renderWebinarInfo()}

                <div className="py-4 px-2 pb-4 flex flex-col text-sm bg-primary-light-100">
                  <h4>Please Note</h4>
                  <ul className="py-2 list-none">
                    <li className="mb-2">
                      You can access the training information by login in to
                      your hcprofs dashboard.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="w-full screen_var_one:w-[40%] flex flex-col bg-primary-light-100">
                {renderPurchaseDescription()}

                <div className="px-4 py-2">
                  <ButtonCustom
                    className="w-full h-8 py-2 bg-primary-bg-interactiveBlue font-semibold text-sm text-white rounded-full leading-3 hover:bg-primary-bg-interactiveBlueHover"
                    label={"Buy Now"}
                    handleClickWithLoader={onBuyNow}
                  />
                </div>

                <div className="py-2 self-center text-green-600 text-xs">
                  <Link to={LINK_PAGE_REFUND_AND_CANCELLATION}>
                    See Refund Policy
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full p-5 border border-primary-light-900">
              <div className="text-base leading-6 text-justify text-pretty">
                <h4 className="font-bold text-left underline">
                  {"Description"}
                </h4>
                <p className="mt-2">{webinarData?.description}</p>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default PageWebinarInfo;
