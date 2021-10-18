import { AxiosResponse } from "axios";
import Transport from "./transport";
export default class TransportLegacySeedz extends Transport {
    private credentials;
    private token;
    constructor(credentials: any);
    getCredentials(): any;
    setCredentials(credentials: any): this;
    authenticate(): Promise<void>;
    private getHeaders;
    init(scope: any, connector: any): Promise<void>;
    private request;
    send(protocol: string, entity: string, page: number, content: any): Promise<AxiosResponse | void>;
}
