import axios, { Axios } from "axios";

export default abstract class AbstractTransport {
  public agent: Axios;
  constructor(baseURL: string) {
    this.agent = axios.create({
      baseURL,
    });
  }
  async authenticate(): Promise<void> {}
  async init(scope: any, connector: any): Promise<void> {}
  onError(exception: unknown): void {}
}
