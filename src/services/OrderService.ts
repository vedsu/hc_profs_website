import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class OrderService extends BaseApiService {
  createOrder = (payload: any) => {
    let path = DEFAULT_PATH + "order";
    return this.makePostRequest(path, payload);
  };
}

export default new OrderService();
