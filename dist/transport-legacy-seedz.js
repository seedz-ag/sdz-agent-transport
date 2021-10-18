"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
class TransportLegacySeedz extends transport_1.default {
    constructor(credentials) {
        super("https://landing-dev.seedz.ag/api/v1/");
        this.setCredentials(credentials);
    }
    getCredentials() {
        return this.credentials;
    }
    setCredentials(credentials) {
        this.credentials = this.credentials;
        return this;
    }
    async authenticate() {
        var _a;
        const response = await this.request("POST", "auth/login", this.getCredentials());
        if ((_a = response.data) === null || _a === void 0 ? void 0 : _a.accessToken) {
            this.token = response.data.accessToken;
            return true;
        }
        else {
            return false;
        }
    }
    getHeaders() {
        return {
            headers: {
                Authentication: this.token,
            },
        };
    }
    async init(scope, connector) {
        try {
            const repository = await connector.getRepository();
            const summary = [];
            for (const entity of scope) {
                const qtnRegisters = await repository.count(entity.name.toLowerCase());
                summary.push({
                    entity: entity.name,
                    qtnPages: Math.ceil(qtnRegisters / 100).toFixed(0),
                    qtnRegisters,
                });
            }
            return this.request("POST", "/processing/planning", { summary }, true);
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
    async send(protocol, entity, page, content) {
        try {
            return this.request("POST", "/data/receive", {
                protocol,
                entity,
                content,
                page,
            }, true);
        }
        catch (exception) {
            this.onError(exception);
        }
    }
}
exports.default = TransportLegacySeedz;
