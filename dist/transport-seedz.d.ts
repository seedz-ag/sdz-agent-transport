import { AxiosResponse } from "axios";
import Transport from "./transport";
import { Credentials } from "sdz-agent-types";
export default class TransportSeedz extends Transport {
    private credentials;
    private uriMap;
    constructor(apiUrl: string, credentials: Credentials);
    getCredentials(): Credentials | undefined;
    setCredentials(credentials: Credentials): this;
    getUriMap(): {
        [key: string]: string;
    };
    setUriMap(uriMap: {
        [key: string]: string;
    }): this;
    private request;
    send(entity: string, body: any): Promise<AxiosResponse | void>;
}
