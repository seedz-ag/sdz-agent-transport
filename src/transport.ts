import axios, { Axios } from "axios";

export default class AbstractTransport {
  public agent: Axios;
  constructor(baseURL: string) {
    if (new.target === AbstractTransport) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    this.agent = axios.create({
      baseURL,
    });
  }
  async authenticate(): Promise<void> {}
  async init(scope: any, connector: any): Promise<void> {}
  onError(exception: unknown): void {}
}
