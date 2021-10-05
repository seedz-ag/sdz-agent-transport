import axios, { Axios, AxiosResponse } from "axios";

export default class TransportSeedz {
  private agent: Axios;
  private credentials: any;
  private token: string;

  constructor(credentials: any) {
    this.agent = axios.create({
      baseURL: "https://landing.seedz.ag/",
    });
    this.credentials = credentials;
  }

  async authenticate(): Promise<void> {
    const response = await this.agent.post("auth", this.credentials, {});
    // this.token = response
  }

  send(endpoint: string, data: any[]): Promise<AxiosResponse> {
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
