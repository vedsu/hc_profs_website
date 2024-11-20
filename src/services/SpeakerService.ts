import BaseApiService from "./BaseApiService";

const DEFAULT_PATH = "/";

class SpeakerService extends BaseApiService {
  getSpeakers = () => {
    let path = DEFAULT_PATH;
    return this.makeGetRequest(path);
  };

  getSpeakerById = (endPoint: any) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makeGetRequest(path);
  };

  createSpeakerOpportunity = (endPoint: any, payload: any) => {
    let path = DEFAULT_PATH + endPoint;
    return this.makePostRequest(path, payload);
  };
}

export default new SpeakerService();
