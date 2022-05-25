import { AxiosResponse, Method } from "axios";

import { Credentials } from "sdz-agent-types";
import Transport from "./transport";
import moment from "moment";

type URIMap = {
  [key: string]: string;
};

export default class TransportSeedz extends Transport {
  private credentials: Credentials | undefined;
  private issuerUrl: string;
  private uriMap: { [key: string]: string } = {};
  private timeout: any; 
  private token: string;

  constructor(issuerUrl: string, apiUrl: string, credentials?: Credentials) {
    super(apiUrl);
    this.setCredentials(credentials);
    this.setIssuerURL(issuerUrl);
  }

  // GETTERS AND SETTERS

  getCredentials(): Credentials {
    return this.credentials;
  }

  setCredentials(credentials?: Credentials): this {
    this.credentials = credentials;
    return this;
  }

  getIssuerURL(): string {
    return this.issuerUrl;
  }

  setIssuerURL(issuerUrl: string): this {
    this.issuerUrl = issuerUrl;
    return this;
  }

  getOpenIdHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
    };
  }

  getToken(): string {
    return this.token;
  }

  setToken(token: string): this {
    this.token = token;
    return this;
  }

  getUriMap(): URIMap {
    return this.uriMap;
  }

  setUriMap(uriMap: URIMap): this {
    this.uriMap = uriMap;
    return this;
  }

  // METHODS

  async authenticate(): Promise<void> {
    try {
      const { data }: any = await this.agent.request({
        url: `${this.getIssuerURL()}/token`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: `client_id=${encodeURIComponent(
          this.getCredentials().client_id
        )}&client_secret=${encodeURIComponent(
          this.getCredentials().client_secret
        )}&grant_type=client_credentials`,
        method: "POST",
      });
      this.token = data.access_token;
      this.refresh(data.expires_at);
    } catch (e) {
      console.log(e);
      throw new Error("Authentication failed");
    }
  }

  public async refresh(expires_at: number): Promise<this> {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      this.authenticate.bind(this),
      moment(expires_at, "X").diff(moment(), "seconds") * 900
    );
    return this;
  }

  private async request<T>(
    method: Method = "GET",
    url: string,
    data: any
  ): Promise<T> {
    return this.agent.request({
      data,
      headers: {
        ...this.getOpenIdHeaders(),
      },
      maxBodyLength: 1000000000,
      maxContentLength: 100000000,
      method,
      url,
    });
  }

  async send(entity: string, body: any): Promise<AxiosResponse<any> | void> {
    try {
      !this.token && (await this.authenticate());
      return this.request("POST", this.uriMap[entity], body);
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }
}
