import { AxiosResponse, Method } from "axios";
import Transport from "./transport";

export default class TransportSeedz extends Transport {
  constructor(credentials: any) {
    super("http://localhost:3000/");
  }

  private async request<T>(
    method: Method = "GET",
    url: string,
    data: any,
    needsToken = false
    
  ): Promise<T> {
    console.log(url)
    return this.agent.request({
      data,
      method,
      url,
    });
  }

  async send(entity: string, body: any): Promise<AxiosResponse | void> {
    try {
      return this.request(
        "POST",
        "/batch",
        {
          batch: [
            {
              body,
              id: "",
              method: "POST",
              headers: {
                client: "",
                guid: ""
              },
              uri: this.getURIMap(entity),
            }
          ]
        },
        true
      );
    } catch (exception: unknown) {
      this.onError(exception);
    }
  }

  private getURIMap(entity: string): string {
    const map: { [key: string]: string } = {
      cliente: 'client'
    };
    return map[entity];
  }
}
