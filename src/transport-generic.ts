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
        case "data":
          this.auth = response.data[map.response];
          break;
        case "headers":
          this.auth = response.headers[map.response];
          break;
        default:
          throw new Error("UNKNOW TYPE OF AUTHENTICATION");
      }
    }
  }

  createAgentInstance(): this {
    this.agent = axios.create({
      baseURL: this.baseURL,
    });
    return this;
  }

  private mapResponse(map: any, response: AxiosResponse): any {
    switch (map.type) {
      case "data":
        this.auth = response.data[map.response];
        break;
      case "headers":
        this.auth = response.headers[map.response];
        break;
      default:
        throw new Error("UNKNOW TYPE OF AUTHENTICATION");
    }
  }

  async process(type: string, data: any) {
    const map = this.map[type];

    if (!map) {
      throw new Error("UNKOW MAP");
    }
    const response = await this.request(
      map.method || "POST",
      map.url,
      data
    );

    return this.mapResponse(map, response);
  }

  request(method: any, url: string, data: any): Promise<AxiosResponse> {
    const headers: any = {};
    if (this.auth) {
      headers.Authorization = `Bearer ${this.auth}`;
    }
    return this.agent.request({
      data,
      headers,
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
