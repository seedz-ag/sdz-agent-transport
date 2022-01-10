"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
class TransportSeedz extends transport_1.default {
    constructor(apiUrl, credentials) {
        super(apiUrl);
        this.uriMap = {};
        this.setCredentials(credentials);
    }
    // GETTERS AND SETTERS
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = credentials;
        return this;
    }
    getUriMap() {
        return this.uriMap;
    }
    setUriMap(uriMap) {
        this.uriMap = uriMap;
        return this;
    }
    async request(method = "GET", url, data, needsAuthentication = false) {
        return this.agent.request({
            data,
            headers: {
                ...(needsAuthentication ? this.getCredentials() : {})
            },
            method,
            url,
        });
    }
    async send(entity, body) {
        try {
            return this.request("POST", this.uriMap[entity], body, true);
        }
        catch (exception) {
            this.onError(exception);
        }
    }
}
exports.default = TransportSeedz;
