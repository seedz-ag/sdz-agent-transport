import {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from "axios";
import Transport from "./transport";

export default class TransportLegacySeedz extends Transport {
  private credentials: any;
  private token: string;
  private protocol: string;
  private pages: any = {}

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
        Authorization: this.token ? `Bearer ${ this.token }` : "",
      },
    };
  }

  async init(scope: any, connector: any): Promise<void> {
    try {
      const repository = await connector.getRepository();
      const summary: any[] = [] ;

      for (const entity of scope) {
        const qntRegisters = parseInt((await repository.count(entity.name.toLowerCase()))[0].total);
        summary.push({
            entity: entity.name,
            qntPages: parseInt(Math.ceil(qntRegisters / 100).toFixed(0)),
            qntRegisters: qntRegisters,
        });
    }
      const response =  await this.request(
        "POST",
        "/processing/planning",
        { summary },
        true
      );
      this.protocol = response.data.protocol

    } catch (exception: unknown) {
      this.onError(exception);
    }
  }

  private async request<T>(
    method: Method = "GET",
    url: string,
    data: any,
    needsToken = false
  ): Promise<any> {
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
    entity: string,
    content: any
  ): Promise<AxiosResponse | void> {
    try {
      if(!this.pages [entity])
      {
        this.pages[entity] = 0;
      }
      this.pages[entity]++

      return this.request(
        "POST",
        "/data/receive",
        {
          protocol : this.protocol,
          entity,
          page: this.pages[entity],
          content,
        },
        true
      );
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }
}
