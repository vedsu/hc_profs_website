import React, { useEffect, useState } from "react";
import AuthValidator from "../../components/AuthValidator";
import { LOCAL_STORAGE_ITEMS, USER_ROLE } from "../../constant";
import DashboardService from "../../services/DashboardService";
import { validateGetRequest } from "../../utils/commonUtils";

function PageUserHistory() {
  const [
    attendeeDashboardHistoryPurchased,
    setAttendeeDashboardHistoryPurchased,
  ] = useState([]);
  const [attendeeDashboardHistoryPending, setAttendeeDashboardHistoryPending] =
    useState([]);
  const [attendeeDashboardNewsletterPurchased, setAttendeeNewsletterPurchased] =
    useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const onMount = async () => {
      await getAttendeeDashBoardInfo();
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
          setAttendeeDashboardHistoryPending(res?.data?.[1]);
          setAttendeeDashboardHistoryPurchased(res?.data?.[2]);
          setAttendeeNewsletterPurchased(res?.data?.[4]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <AuthValidator>
      <div className="w-full p-5 flex flex-col text-sm">
        <h4 className="font-semibold text-2xl text-primary-pLabel ">History</h4>
        {isLoading ? (
          <div className="min-h-[40vh] flex-grow flex items-center justify-center">
            <span>
              <i className="pi pi-spinner text-primary-bg-teal text-4xl animate-spin" />
            </span>
          </div>
        ) : (
          <React.Fragment>
            {attendeeDashboardHistoryPurchased?.length ? (
              <React.Fragment>
                <div className="px-2 flex flex-col gap-5">
                  <div>
                    <div className="my-2 text-left font-semibold text-sm">
                      <div className="px-2">Purchased</div>
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
                        <div className="px-2">Pending</div>
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

                <div className="px-2">
                  <div className="my-2 text-left font-semibold text-sm">
                    <div className="px-2">Newsletter</div>
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
              </React.Fragment>
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

export default PageUserHistory;
