import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/newsletter_panel";

class NewsletterService extends BaseApiService {
  getNewsletters = () => {
    const path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  getNewsletterById = (endPoint: any) => {
    const path = "/newsletter" + "/" + endPoint;
    return this.makeGetRequest(path);
  };
}

export default new NewsletterService();
