import { Axios } from "axios";
export default class AbstractTransport {
    agent: Axios;
    constructor(baseURL: string);
    init(scope: any, connector: any): Promise<void>;
    onError(exception: unknown): void;
}
