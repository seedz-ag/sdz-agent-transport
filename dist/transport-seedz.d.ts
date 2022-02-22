import { AxiosResponse } from "axios";
import { Credentials } from "sdz-agent-types";
import Transport from "./transport";
declare type URIMap = {
    [key: string]: string;
};
export default class TransportSeedz extends Transport {
    private credentials;
    private issuerUrl;
    private uriMap;
    private timeout;
    private token;
    constructor(issuerUrl: string, apiUrl: string, credentials?: Credentials);
    getCredentials(): Credentials;
    setCredentials(credentials?: Credentials): this;
    getIssuerURL(): string;
    setIssuerURL(issuerUrl: string): this;
    getOpenIdHeaders(): {
        Authorization: string;
    };
    getToken(): string;
    setToken(token: string): this;
    getUriMap(): URIMap;
    setUriMap(uriMap: URIMap): this;
    authenticate(): Promise<void>;
    refresh(expires_at: number): Promise<this>;
    private request;
    send(entity: string, body: any): Promise<AxiosResponse<any> | void>;
}
export {};
