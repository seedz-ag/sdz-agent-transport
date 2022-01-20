"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
class TransportSeedz extends transport_1.default {
    constructor(issuerUrl, apiUrl, credentials) {
        super(apiUrl);
        this.uriMap = {};
        this.setCredentials(credentials);
        this.setIssuerURL(issuerUrl);
    }
    // GETTERS AND SETTERS
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = credentials;
        return this;
    }
    getIssuerURL() {
        return this.issuerUrl;
    }
    setIssuerURL(issuerUrl) {
        this.issuerUrl = issuerUrl;
        return this;
    }
    getOpenIdHeaders() {
        return {
            Authorization: `Bearer ${this.token}`,
            ClientId: this.getCredentials().client_id,
        };
    }
    getUriMap() {
        return this.uriMap;
    }
    setUriMap(uriMap) {
        this.uriMap = uriMap;
        return this;
    }
    // METHODS
    async authenticate() {
        try {
            const { data } = await this.agent.request({
                url: `${this.getIssuerURL()}/token`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: `client_id=${encodeURIComponent(this.getCredentials().client_id)}&client_secret=${encodeURIComponent(this.getCredentials().client_secret)}&grant_type=client_credentials`,
                method: "POST",
            });
            this.token = data.access_token;
        }
        catch (e) {
            throw new Error("Authentication failed");
        }
    }
    async request(method = "GET", url, data) {
        return this.agent.request({
            data,
            headers: {
                ...this.getOpenIdHeaders(),
            },
            maxBodyLength: 1000000000,
            maxContentLength: 100000000,
            method,
            url,
        });
    }
    async send(entity, body) {
        try {
            !this.token && (await this.authenticate());
            return this.request("POST", this.uriMap[entity], body);
        }
        catch (exception) {
            this.onError(exception);
        }
    }
}
exports.default = TransportSeedz;
