"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class AbstractTransport {
    constructor(baseURL) {
        if (new.target === AbstractTransport) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.agent = axios_1.default.create({
            baseURL,
        });
    }
    async init(scope, connector) { }
    onError(exception) { }
}
exports.default = AbstractTransport;
