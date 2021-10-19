"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transport_1 = __importDefault(require("./transport"));
class TransportSeedz extends transport_1.default {
    constructor(credentials) {
        super("http://localhost:3000/");
    }
    async request(method = "GET", url, data, needsToken = false) {
        return this.agent.request({
            data,
            method,
            url,
        });
    }
    async send(entity, body) {
        try {
            return this.request("POST", "/batch", {
                batch: body.map((item, index) => ({
                    body: item,
                    id: index,
                    method: "POST",
                    headers: {
                        client: "",
                        guid: "",
                    },
                    uri: this.getURIMap(entity),
                })),
            }, true);
        }
        catch (exception) {
            this.onError(exception);
        }
    }
    getURIMap(entity) {
        const map = {
            cliente: "client",
        };
        return map[entity];
    }
}
exports.default = TransportSeedz;
