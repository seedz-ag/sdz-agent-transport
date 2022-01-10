import { AxiosResponse, Method } from "axios";
import Transport from "./transport";
import { Credentials } from "sdz-agent-types";

export default class TransportSeedz extends Transport {
  private credentials: Credentials;
  private uriMap: { [key: string]: string } = {};

  constructor(apiUrl: string, credentials: Credentials) {
    super(apiUrl);
    this.setCredentials(credentials);
  }

  // GETTERS AND SETTERS

  getCredentials(): Credentials | undefined {
    return this.credentials;
  }

  setCredentials(credentials: Credentials): this {
    this.credentials = credentials;
    return this;
  }

  getUriMap(): { [key: string]: string } {
    return this.uriMap;
  }

  setUriMap(uriMap: { [key: string]: string }): this {
    this.uriMap = uriMap;
    return this;
  }

  private async request<T>(
    method: Method = "GET",
    url: string,
    data: any,
    needsAuthentication = false
  ): Promise<T> {
    return this.agent.request({
      data,
      headers: {
        ...(needsAuthentication ? this.getCredentials() : {}),
      },
      maxBodyLength: 1000000000,
      maxContentLength: 100000000,
      method,
      url,
    });
  }

  async send(entity: string, body: any): Promise<AxiosResponse | void> {
    try {
      return this.request("POST", this.uriMap[entity], body, true);
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }
}
