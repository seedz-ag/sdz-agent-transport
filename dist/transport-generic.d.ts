import { AxiosResponse } from "axios";
export default class {
    private agent;
    private auth;
    private baseURL;
    private map;
    constructor(map: any, baseURL: string);
    authenticate(): Promise<void>;
    createAgentInstance(): this;
    private mapResponse;
    process(type: string, data: any): Promise<any>;
    request(method: any, url: string, data: any): Promise<AxiosResponse>;
    setBaseURL(baseURL: string): this;
    setMap(map: any): this;
}
