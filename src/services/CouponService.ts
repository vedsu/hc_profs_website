import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class CouponService extends BaseApiService {
  getCouponList = () => {
    let path = DEFAULT_PATH + "coupon";
    return this.makeGetRequest(path);
  };
}

export default new CouponService();
