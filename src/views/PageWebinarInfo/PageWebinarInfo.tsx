import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ButtonCustom from "../../components/ButtonCustom";
import {
  HEALTH_PROFS,
  LOCAL_STORAGE_ITEMS,
  SESSION_STORAGE_ITEMS,
} from "../../constant";
import {
  LINK_PAGE_CART,
  LINK_PAGE_LOGIN_REG,
  LINK_PAGE_REFUND_AND_CANCELLATION,
} from "../../routes";
import WebinarService from "../../services/WebinarService";
import {
  getInitialLetterUpperCase,
  monDayYear,
  validateGetRequest,
} from "../../utils/commonUtils";
import { PURCHASE_TYPE_LITERAL } from "../PageCart/PageCart";

const initialPurchaseData = {
  webinarSessionLive: false,
  webinarSessionRecording: false,
  webinarSessionDD: false,
  webinarSessionTranscript: false,
};

const PageWebinarInfo: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isLoadingWebinar, setIsLoadingWebinar] = useState(true);
  const [webinarData, setWebinarData] = useState<any>(null);
  const [speakerData, setSpeakerData] = useState<any>(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [showCartEmptyMessage, setShowCartEmptyMessage] = useState(false);
  const [purchaseData, setPurchaseData] = useState(initialPurchaseData);

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

  /*--------------------------Event Handlers-----------------*/
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
    const isTranscriptChecked = (
      document.getElementById("checkbox-buy-trans") as HTMLInputElement
    )?.checked;

    const livePrice = Number(webinarData?.priceLive ?? "0");
    const recordingPrice = Number(webinarData?.priceRecording ?? "0");
    const ddPrice = Number(webinarData?.priceDigitalDownload ?? "0");
    const transcriptPrice = Number(webinarData?.priceTranscript ?? "0");

    if (isLiveChecked) amt += livePrice;
    if (isRecordingChecked) amt += recordingPrice;
    if (isDDChecked) amt += ddPrice;
    if (isTranscriptChecked) amt += transcriptPrice;

    setCartTotal(amt);
    setPurchaseData({
      webinarSessionLive: Number(livePrice) ? true : false,
      webinarSessionRecording: Number(recordingPrice) ? true : false,
      webinarSessionDD: Number(ddPrice) ? true : false,
      webinarSessionTranscript: Number(transcriptPrice) ? true : false,
    });
    setShowCartEmptyMessage(false);
  };

  const onBuyNow = async () => {
    const isUserLoggedIn = localStorage.getItem(LOCAL_STORAGE_ITEMS.USERINFO);

    if (isUserLoggedIn && cartTotal > 0) {
      navigate(`${LINK_PAGE_CART}?purchase-category=webinar`);
      localStorage.setItem(
        LOCAL_STORAGE_ITEMS.PURCHASE_INFO,
        JSON.stringify({
          ...purchaseData,
          webinarId: params?.webinar,
          cartTotal: cartTotal,
        })
      );
    } else if (isUserLoggedIn && cartTotal === 0) {
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
          ...webinarData,
          purchaseType: PURCHASE_TYPE_LITERAL.WEBINAR,
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
      <div className="p-5 w-full flex-grow flex flex-col gap-2 screen_var_one:p-0">
        <div className="text-left font-semibold">
          <div>{webinarData?.topic ?? "N.A."}</div>
        </div>
        <div className="text-left text-sm">
          <span className="font-semibold">{"Industry : "}</span>
          <span>
            {`${getInitialLetterUpperCase(webinarData?.industry) ?? "N.A."}`}
          </span>
        </div>
        <div className="text-left text-sm">
          <span className="font-semibold">{"Category : "}</span>
          <span>
            {getInitialLetterUpperCase(webinarData?.category) ?? "N.A."}
          </span>
        </div>
        <div className="text-left text-sm">
          <span className="font-semibold">{"Date : "}</span>
          <span>{monDayYear(webinarData?.date) ?? "N.A."}</span>
        </div>
        <div className="text-left text-sm">
          <span className="font-semibold">{"Time : "}</span>
          <span>
            {`${getInitialLetterUpperCase(webinarData?.time) ?? "N.A."} ${
              webinarData?.timeZone ?? "N.A."
            }`}
          </span>
        </div>
        <div className="text-left text-sm">
          <span className="font-semibold">{"Duration : "}</span>
          <span>
            {`${
              getInitialLetterUpperCase(webinarData?.duration) ?? "N.A."
            } minutes`}
          </span>
        </div>
      </div>
    );
  };

  const renderSpeakerInfo = (): ReactNode => {
    return (
      <div>
        <div className="w-full flex flex-col gap-5 items-center">
          <div className="min-w-[300px] flex items-center justify-center text-xs">
            <img
              className="w-24 h-24 rounded-[50%]"
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
      </div>
    );
  };

  const renderPurchaseDescription = (): ReactNode => {
    return (
      <React.Fragment>
        <div className="w-full flex bg-blue-200 font-semibold text-base">
          <div className="w-[50%] h-10">
            <button
              id="login-tab"
              className={`log-reg-tab w-full h-full `}
              // onClick={onTabClick}
            >
              Individual
            </button>
          </div>
          <div className="w-[50%] h-10">
            <button
              id="register-tab"
              className={`log-reg-tab w-full h-full `}
              // onClick={onTabClick}
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
                <th>{"Price ($)"}</th>
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
                      {"Live"}
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
                  <td>{webinarData?.priceLive}</td>
                </tr>
              )}
              <tr>
                <td>
                  <label
                    htmlFor="checkbox-buy-recording"
                    className="webinar-purchase-label"
                  >
                    {"Recording"}
                    <input
                      id="checkbox-buy-recording"
                      type="checkbox"
                      className="buy-webinar-input"
                      onChange={handlePurchaseInput}
                    />
                    <span className="check-mark"></span>
                  </label>
                </td>
                <td>{webinarData?.priceRecording}</td>
              </tr>
              <tr>
                <td>
                  <label
                    htmlFor="checkbox-buy-dd"
                    className="webinar-purchase-label"
                  >
                    {"Digital Download"}
                    <input
                      id="checkbox-buy-dd"
                      type="checkbox"
                      className="buy-webinar-input"
                      onChange={handlePurchaseInput}
                    />
                    <span className="check-mark"></span>
                  </label>
                </td>
                <td>{webinarData?.priceDigitalDownload}</td>
              </tr>
              <tr>
                <td>
                  <label
                    htmlFor="checkbox-buy-trans"
                    className="webinar-purchase-label"
                  >
                    {"Transcript"}
                    <input
                      id="checkbox-buy-trans"
                      type="checkbox"
                      className="buy-webinar-input"
                      onChange={handlePurchaseInput}
                    />
                    <span className="check-mark"></span>
                  </label>
                </td>
                <td>{webinarData?.priceTranscript}</td>
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
            <div className="w-full flex flex-col items-center justify-between screen_var_one:flex-row">
              {renderSpeakerInfo()}
              {renderWebinarInfo()}
            </div>

            <div className="w-full flex flex-col-reverse gap-10 place-items-center screen_var_one:flex-row screen_var_one:place-items-start">
              <div className="w-full screen_var_one:w-[50%] p-5 border border-primary-light-900">
                <div className="text-sm leading-6 text-justify text-pretty">
                  <h4 className="text-left">{"Description"}</h4>
                  <p>{webinarData?.description}</p>
                </div>
              </div>

              <div className="w-full screen_var_one:w-[50%] flex flex-col bg-primary-light-100">
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

                <div className="px-4 pb-4 flex flex-col text-sm">
                  <h4>Please Note</h4>
                  <ul className="py-2 list-none">
                    <li className="mb-2">
                      Live Webinar Training: A real-time virtual webinar link
                      and instructions will be provided 24 hours before each
                      session.
                    </li>
                    <li className="mb-2">
                      Recorded Webinar: A pre-recorded event available for 30
                      days. The recording will be sent 24-48 hours after the
                      live session concludes.
                    </li>
                    <li className="mb-2">
                      Digital Download: A file available for download,
                      accessible for 30 days. It will be provided 3-7 working
                      days after the live session.
                    </li>
                    <li className="mb-2">
                      Transcript: A written form of the webinar, including
                      participant questions and presenter comments, available
                      for 30 days. It will be sent within 3-7 working days after
                      the live session.
                    </li>
                    <li className="mb-2">
                      Also, You can access the training information by login in
                      your dashboard hcprofs .
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </section>
  );
};

export default PageWebinarInfo;
