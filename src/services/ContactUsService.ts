import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class ContactUsService extends BaseApiService {
  contactUs = (payload: any) => {
    let path = DEFAULT_PATH + "contactus";
    return this.makePostRequest(path, payload);
  };
}

export default new ContactUsService();
