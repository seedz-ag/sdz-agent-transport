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
  init(scope: any, connector: any): void {}
  onError(exception: unknown): void {}
}
