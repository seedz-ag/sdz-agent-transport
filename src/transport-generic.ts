import axios, { Axios, AxiosResponse } from "axios";

export default class {
  private agent: Axios;
  private auth: any;
  private baseURL: string;
  private map: any;

  constructor(map: any, baseURL: string) {
    this.setBaseURL(baseURL);
    this.setMap(map);
    this.createAgentInstance();
  }

  async authenticate(): Promise<void> {
    if (this.map.auth) {
      const map = this.map.auth;
      const response = await this.request(
        map.method || "POST",
        map.url,
        map.credentials
      );
      switch (map.type) {
        case 'data': this.auth = response.headers[map.response]; break;
        case 'headers': this.auth = response.headers[map.response]; break;
        default: throw new Error('UNKNOW TYPE OF AUTHENTICATION');
      }
    }
  }

  createAgentInstance(): this {
    this.agent = axios.create({
      baseURL: this.baseURL,
    });
    return this;
  }

  process(type: string) {
    const map = this.map[type];

    if (!map) {
      throw new Error('UNKOW MAP');
    }
  }

  request(method: any, url: string, data: any): Promise<AxiosResponse> {
    return this.agent.request({
      data,
      method,
      url,
    });
  }

  setBaseURL(baseURL: string): this {
    this.baseURL = baseURL;
    return this;
  }

  setMap(map: any): this {
    this.map = map;
    return this;
  }
}
