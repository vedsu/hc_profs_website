import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class SubscriptionService extends BaseApiService {
  subscribe = (payload: any) => {
    let path = DEFAULT_PATH + "subscribe";
    return this.makePostRequest(path, payload);
  };

  unsubscribe = (payload: any) => {
    let path = DEFAULT_PATH + "unsubscribe";
    return this.makePostRequest(path, payload);
  };
}

export default new SubscriptionService();
