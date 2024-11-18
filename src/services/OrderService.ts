import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class OrderService extends BaseApiService {
  createOrder = (payload: any) => {
    let path = DEFAULT_PATH + "order";
    return this.makePostRequest(path, payload);
  };
  createOrderCorporate = (payload: any) => {
    let path = DEFAULT_PATH + "corportateorder";
    return this.makePostRequest(path, payload);
  };
  createNewsletterOrder = (payload: any) => {
    let path = DEFAULT_PATH + "newsletterorder";
    return this.makePostRequest(path, payload);
  };
}

export default new OrderService();
