import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class AuthService extends BaseApiService {
  login = (endPoint: string, payload: any) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
  register = (endPoint: string, payload: any) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
}

export default new AuthService();
