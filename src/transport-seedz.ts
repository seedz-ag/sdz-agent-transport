import axios, { Axios, AxiosError, AxiosResponse } from "axios";

export default class TransportSeedz {
  private agent: Axios;
  private credentials: any;
  private token: string;

  constructor(credentials: any) {
    this.agent = axios.create({
      baseURL: "https://landing.seedz.ag/api/",
    });
    this.credentials = credentials;
  }

  async authenticate(): Promise<void> {
    try {
      const response = await this.agent.post("auth", this.credentials, {});
    // this.token = response
    } catch (error: any) {
      this.onError(error);
    }
  }

  private onError(error: any): void {
    console.log(error.request);
    throw new Error(error.response.statusText);
  }

  send(endpoint: string, data: any[]): Promise<AxiosResponse> | void {
    if (!this.token) {
      throw new Error("CANNOT SEND DATA WITHOUT AN VALID TOKEN");
    }
    try {
      return this.agent.post(endpoint, data, {
        headers: {
          Authentication: this.token,
        },
      });
    } catch (error: any) {
      this.onError(error);
    }
  }
}
