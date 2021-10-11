import { AxiosResponse } from "axios";
export default class TransportSeedz {
    private agent;
    private credentials;
    private token;
    constructor(credentials: any);
    authenticate(): Promise<any>;
    send(endpoint: string, data: any): Promise<AxiosResponse>;
}
