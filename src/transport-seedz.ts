import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";

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

  async authenticate(): Promise<boolean> {
    const response = await this.request<AxiosResponse<any>>(
      "POST",
      "auth/login",
      this.credentials
    );
    if (response.data?.accessToken) {
      this.token = response.data.accessToken;
      return true;
    } else {
      return false;
    }
  }

  private getHeaders(): AxiosRequestConfig {
    return {
      headers: {
        Authentication: this.token,
      },
    };
  }

  async plan(
    entity: string,
    qntPages: number,
    qntRegisters: number
  ): Promise<AxiosResponse | void> {
    try {
      return this.request(
        "POST",
        "/processing/planning",
        {
          entity,
          qntPages,
          qntRegisters,
        },
        true
      );
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }

  private onError(exception: unknown): void {}

  private async request<T>(
    method: Method = "GET",
    url: string,
    data: any,
    needsToken = false
  ): Promise<T> {
    if (needsToken && !this.token) {
      await this.authenticate();
    }
    return this.agent.request({
      ...this.getHeaders(),
      data,
      method,
      url,
    });
  }

  async send(
    protocol: string,
    entity: string,
    page: number,
    content: any
  ): Promise<AxiosResponse | void> {
    try {
      return this.request(
        "POST",
        "/data/receive",
        {
          protocol,
          entity,
          content,
          page,
        },
        true
      );
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }
}
