import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InterfaceError from "../../components/InterfaceError";
import SpeakerService from "../../services/SpeakerService";
import {
  getInitialLetterUpperCase,
  validateGetRequest,
} from "../../utils/commonUtils";

const PageSpeakerInfo: React.FC = () => {
  const params = useParams();

  const [isLoadingSpeaker, setIsLoadingSpeaker] = useState(true);
  const [speakerData, setSpeakerData] = useState<any>(null);

  /*---------------------------Service Calls------------------------------*/
  const getSpeakerDetails = useCallback(async () => {
    try {
      const response = await SpeakerService.getSpeakerById(
        `speaker/${params?.speakerId}`
      );
      if (validateGetRequest(response)) {
        const speaker = response?.data;
        // speaker info
        if (speaker) {
          setSpeakerData(speaker);
          setIsLoadingSpeaker(false);
        } else {
          setSpeakerData({});
          setIsLoadingSpeaker(false);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [params?.speakerId]);

  /*------------------------useEffect----------------------------*/
  useEffect(() => {
    const onMount = async () => {
      await getSpeakerDetails();
    };
    onMount();
  }, [getSpeakerDetails]);

  return (
    <div className="page-margin w-full min-h-[60vh] px-5 screen_var_one:px-0">
      <section className="my-10 p-5 border border-primary-light-900">
        <div className="w-full flex items-center justify-center gap-5">
          {isLoadingSpeaker ? (
            <div className="w-full h-[400px] flex items-center justify-center">
              <span>
                <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
              </span>
            </div>
          ) : (
            <>
              {Object.keys(speakerData)?.length ? (
                <React.Fragment>
                  <div className="w-full flex flex-col items-start justify-between gap-5 sm:flex-row">
                    <div className="flex flex-col gap-5">
                      <div className="w-[150px] h-[150px] flex items-center justify-center  border border-primary-light-900 rounded-lg">
                        <img
                          className="w-full h-full border rounded-lg object-fill text-xs"
                          src={speakerData?.photo}
                          alt={getInitialLetterUpperCase(speakerData?.name)}
                        />
                      </div>

                      <div className="w-full text-center font-semibold text-sm leading-6">
                        <div>
                          {getInitialLetterUpperCase(speakerData?.name)}
                        </div>
                        <div>
                          ( {getInitialLetterUpperCase(speakerData?.industry)} )
                        </div>
                      </div>
                    </div>

                    <div className="text-sm leading-6">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: speakerData?.bio,
                        }}
                      />
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <InterfaceError />
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default PageSpeakerInfo;
