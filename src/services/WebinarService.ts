import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class WebinarService extends BaseApiService {
  getWebinars = () => {
    const path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  getWebinarById = (endPoint: any) => {
    const path = DEFAULT_PATH + "webinar" + "/" + endPoint;
    return this.makeGetRequest(path);
  };
}

export default new WebinarService();
