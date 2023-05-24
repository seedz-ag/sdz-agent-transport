"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
const moment_1 = __importDefault(require("moment"));
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
        };
    }
    getToken() {
        return this.token;
    }
    setToken(token) {
        this.token = token;
        return this;
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
            this.refresh(data.expires_at);
        }
        catch (e) {
            throw new Error("Authentication failed");
        }
    }
    async refresh(expires_at) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.authenticate.bind(this), (0, moment_1.default)(expires_at, "X").diff((0, moment_1.default)(), "seconds") * 900);
        return this;
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
            const chunkSize = Number(process.env.CHUNK_SIZE || 250);
            for (let i = 0; i < body.length; i += chunkSize) {
                await this.request("POST", this.uriMap[entity] || entity, body.slice(i, i + chunkSize));
            }
        }
        catch (exception) {
            this.onError(exception);
        }
    }
}
exports.default = TransportSeedz;
