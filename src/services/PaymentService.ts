import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class PaymentService extends BaseApiService {
  createStripePaymentRequest = (payload: any, headers: any) => {
    let path = DEFAULT_PATH + "create-payment-intent";
    return this.makePostRequest(path, payload, headers);
  };
}

export default new PaymentService();
