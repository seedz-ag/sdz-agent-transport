import { Axios } from "axios";
export default abstract class AbstractTransport {
    agent: Axios;
    constructor(baseURL: string);
    authenticate(): Promise<void>;
    init(scope: any, connector: any): Promise<void>;
    onError(exception: unknown): void;
}
