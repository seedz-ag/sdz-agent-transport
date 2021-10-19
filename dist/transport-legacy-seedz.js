"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
class TransportLegacySeedz extends transport_1.default {
    constructor(credentials) {
        super("https://landing.dev.seedz.ag/api/v1/");
        this.pages = {};
        this.setCredentials(credentials);
    }
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = credentials;
        return this;
    }
    async authenticate() {
        var _a;
        const response = await this.request("POST", "auth/login", this.getCredentials());
        if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.accessToken) {
            this.token = response.data.accessToken;
        }
    }
    getHeaders() {
        return {
            headers: {
                Authorization: this.token ? `Bearer ${this.token}` : "",
            },
        };
    }
    async init(scope, connector) {
        try {
            const repository = await connector.getRepository();
            const summary = [];
            for (const entity of scope) {
                const qntRegisters = parseInt((await repository.count(entity.name.toLowerCase()))[0].total);
                summary.push({
                    entity: entity.name,
                    qntPages: parseInt(Math.ceil(qntRegisters / 100).toFixed(0)),
                    qntRegisters: qntRegisters,
                });
            }
            const response = await this.request("POST", "/processing/planning", { summary }, true);
            this.protocol = response.data.protocol;
        }
        catch (exception) {
            this.onError(exception);
        }
    }
    async request(method = "GET", url, data, needsToken = false) {
        if (needsToken && !this.token) {
            await this.authenticate();
        }
        return this.agent.request({
            ...this.getHeaders(),
            data,
            method,
            url,
        });
    }
    async send(entity, content) {
        try {
            if (!this.pages[entity]) {
                this.pages[entity] = 0;
            }
            this.pages[entity]++;
            return this.request("POST", "/data/receive", {
                protocol: this.protocol,
                entity,
                page: this.pages[entity],
                content,
            }, true);
        }
        catch (exception) {
            this.onError(exception);
        }
    }
}
exports.default = TransportLegacySeedz;
