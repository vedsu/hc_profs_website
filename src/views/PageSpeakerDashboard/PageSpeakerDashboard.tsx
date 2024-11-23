import React, { useEffect, useState } from "react";
import { LOCAL_STORAGE_ITEMS, USER_ROLE } from "../../constant";
import UserDashboardLayout from "../../layout/UserDashboard";
import DashboardService from "../../services/DashboardService";
import { validateGetRequest } from "../../utils/commonUtils";

const PageSpeakerDashboard = () => {
  const [profileInfo, setProfileInfo] = useState<any>({});
  const [speakerDashboardData, setSpeakerDashboardInfo] = useState([]);
  const [speakerDashboardHistory, setSpeakerDashboardHistory] = useState([]);

  const accordionTemplateData = [
    {
      title: "Profile",
      description: (
        <React.Fragment>
          <div className="py-3 px-5 font-normal text-sm">
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
        </React.Fragment>
      ),
    },
    {
      title: "History",
      description: (
        <React.Fragment>
          {speakerDashboardHistory?.length ? (
            <div className="px-2 flex flex-col gap-5">
              <div>
                <ul className="text-sm font-normal">
                  {speakerDashboardHistory?.map(
                    (historyItem: any, idx: number) => (
                      <li key={idx + 1} className="my-2 px-2">
                        <span>◈ {historyItem}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-sm font-normal">
              <p className="my-2 px-2 text-center">Nothing to show here.</p>
            </div>
          )}
        </React.Fragment>
      ),
    },
  ];

  useEffect(() => {
    const onMount = async () => {
      await getSpeakersDashBoardInfo();
    };
    onMount();
  }, []);

  /*--------------------Service Calls----------------- */
  const getSpeakersDashBoardInfo = async () => {
    const userDataFromLocalStorage = localStorage.getItem(
      LOCAL_STORAGE_ITEMS.USERINFO
    );

    if (userDataFromLocalStorage) {
      const userInfo = JSON.parse(userDataFromLocalStorage);
      const path = "/" + `${userInfo.email}` + "/" + USER_ROLE.SPEAKER;
      try {
        const res = await DashboardService.getUserDashboardInfo(path);

        if (validateGetRequest(res)) {
          setProfileInfo(userInfo);
          setSpeakerDashboardInfo(res?.data?.[0]);
          setSpeakerDashboardHistory(res?.data?.[1]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  /*----------------------Events Handlers-------------------*/
  const onClickListCard = () => {
    //
  };

  /*-------------------Main Render------------------------*/
  return (
    <UserDashboardLayout
      userInterfaceData={{
        dashboardData: speakerDashboardData,
        onClickWebinarCardHandler: onClickListCard,
        accordionTemplateData: accordionTemplateData,
      }}
    />
  );
};

export default PageSpeakerDashboard;
