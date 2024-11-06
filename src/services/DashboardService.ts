import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/dashboard";

class DashboardService extends BaseApiService {
  getUserDashboardInfo = (endPoint: string) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makeGetRequest(path);
  };
}

export default new DashboardService();
