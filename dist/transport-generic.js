"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class default_1 {
    constructor(map, baseURL) {
        this.setBaseURL(baseURL);
        this.setMap(map);
        this.createAgentInstance();
    }
    async authenticate() {
        if (this.map.auth) {
            const map = this.map.auth;
            const response = await this.request(map.method || "POST", map.url, map.credentials);
            switch (map.type) {
                case "data":
                    this.auth = response.data[map.response];
                    break;
                case "headers":
                    this.auth = response.headers[map.response];
                    break;
                default:
                    throw new Error("UNKNOW TYPE OF AUTHENTICATION");
            }
        }
    }
    createAgentInstance() {
        this.agent = axios_1.default.create({
            baseURL: this.baseURL,
        });
        return this;
    }
    mapResponse(map, response) {
        switch (map.type) {
            case "data":
                this.auth = response.data[map.response];
                break;
            case "headers":
                this.auth = response.headers[map.response];
                break;
            default:
                throw new Error("UNKNOW TYPE OF AUTHENTICATION");
        }
    }
    async process(type, data) {
        const map = this.map[type];
        if (!map) {
            throw new Error("UNKOW MAP");
        }
        const response = await this.request(map.method || "POST", map.url, data);
        return this.mapResponse(map, response);
    }
    request(method, url, data) {
        const headers = {};
        if (this.auth) {
            headers.Authorization = `Bearer ${this.auth}`;
        }
        return this.agent.request({
            data,
            headers,
            method,
            url,
        });
    }
    setBaseURL(baseURL) {
        this.baseURL = baseURL;
        return this;
    }
    setMap(map) {
        this.map = map;
        return this;
    }
}
exports.default = default_1;
