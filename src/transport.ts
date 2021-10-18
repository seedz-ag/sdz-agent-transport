import axios, { Axios } from "axios";

export default class Transport {
  public agent: Axios;
  constructor(baseURL: string) {
    this.agent = axios.create({
      baseURL,
    });
  }
  init(scope: any, connector: any): void {}
  onError(exception: unknown): void {}
}
