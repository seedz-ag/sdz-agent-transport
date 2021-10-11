"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class TransportSeedz {
    constructor(credentials) {
        this.agent = axios_1.default.create({
            baseURL: "https://landing-dev.seedz.ag/api/v1/",
        });
        this.credentials = credentials;
    }
    async authenticate() {
        const response = await this.agent.post("auth/login", this.credentials);
        this.token = response.data.accessToken;
        if (response.data.accessToken) {
            return true;
        }
            return false;
    }
    async send(endpoint, data) {
        if (!this.token) {
            await this.authenticate();
        }
        return this.agent.post(endpoint, data, {
            headers: {
                Authentication: this.token,
            },
        });
    }
}
exports.default = TransportSeedz;
