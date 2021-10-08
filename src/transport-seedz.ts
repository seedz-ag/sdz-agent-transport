import axios, { Axios, AxiosResponse } from "axios";

export default class TransportSeedz {
  private agent: Axios;
  private credentials: any;
  private token: string;

  constructor(credentials: any) {
    this.agent = axios.create({
      baseURL: "https://landing-dev.seedz.ag/api/v1/",
    });
    this.credentials = credentials;
  }

  async authenticate(): Promise<any> {
    const response = await this.agent.post("auth/login", this.credentials);
    this.token = response.data.accessToken;
  }

  async send(endpoint: string, data: any): Promise<AxiosResponse> {
    if (!this.token) {
      throw new Error("CANNOT SEND DATA WITHOUT AN VALID TOKEN");
    }
    return this.agent.post(endpoint, data, {
      headers: {
        Authentication: this.token,
      },
    });
  }
}
