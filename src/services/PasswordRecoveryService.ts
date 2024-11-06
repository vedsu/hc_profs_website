import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class PasswordRecoveryService extends BaseApiService {
  createRecoverRequest = (payload: any) => {
    let path = DEFAULT_PATH + "forgotpassword";
    return this.makePostRequest(path, payload);
  };
}

export default new PasswordRecoveryService();
