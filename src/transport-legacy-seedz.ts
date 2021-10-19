import {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import Transport from "./transport";

export default class TransportLegacySeedz extends Transport {
  private credentials: any;
  private token: string;

  constructor(credentials: any) {
    super("https://landing.dev.seedz.ag/api/v1/");
    this.setCredentials(credentials);
  }

  getCredentials(): any {
    return this.credentials;
  }

  setCredentials(credentials: any): this {
    this.credentials = credentials;
    return this;
  }

  async authenticate(): Promise<void> {
    const response = await this.request<AxiosResponse<any>>(
      "POST",
      "auth/login",
      this.getCredentials()
    );
    if (response.data?.accessToken) {
      this.token = response.data.accessToken;
    }
  }

  private getHeaders(): AxiosRequestConfig {
    return {
      headers: {
        Authentication: this.token || "",
      },
    };
  }

  async init(scope: any, connector: any): Promise<void> {
    try {
      const repository = await connector.getRepository();
      const summary: any[] = [] ;

      for(const entity of scope) {
        const qtnRegisters = (await repository.count(entity.name.toLowerCase()))[0].total;
        summary.push({
          entity: entity.name,
          qtnPages: Math.ceil(qtnRegisters / 100).toFixed(0),
          qtnRegisters,
        });
      }

      return await this.request(
        "POST",
        "/processing/planning",
        { summary },
        true
      );
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }

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
