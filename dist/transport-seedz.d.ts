import { AxiosResponse } from "axios";
import Transport from "./transport";
export default class TransportSeedz extends Transport {
    constructor(credentials: any);
    private request;
    send(entity: string, body: any): Promise<AxiosResponse | void>;
    private getURIMap;
}
